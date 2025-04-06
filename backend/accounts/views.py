from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, parser_classes
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ Доступ только авторизованным
def get_user_details(request):
    print("Получен запрос от:", request.user)  # 🔥 Логируем юзера
    if not request.user.is_authenticated:
        return Response({"error": "Пользователь не авторизован"}, status=401)

    return Response({
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "username": request.user.username
    })


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_details(request, username):  # Используем username вместо id
    try:
        user = User.objects.get(username=username)  # Получаем пользователя по username
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method in ["PUT", "PATCH"]:
        data = request.data
        print("Полученные данные:", request.data)
        user.first_name = data.get("firstName", user.first_name)
        user.last_name = data.get("lastName", user.last_name)
        user.email = data.get("email", user.email)

        user.save()

        return Response({
            "message": "User details updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

    


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            user = User.objects.filter(email=email).first()
            if user is None:
                return JsonResponse({"error": "User not found"}, status=404)

            auth_user = authenticate(username=user.username, password=password)
            if auth_user is None:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

            tokens = get_tokens_for_user(auth_user)  # ✅ Только токены, без login()
            
            print("Отправляем токены:", tokens) 

            return JsonResponse({
                "message": "Login successful",
                "user": {
                    "id": auth_user.id,
                    "username": auth_user.username,
                    "email": auth_user.email,
                    "first_name": auth_user.first_name,
                    "last_name": auth_user.last_name,
                },
                "tokens": tokens
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)



@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            username = data.get("username") or f"user_{User.objects.count() + 1}"

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "User already exists"}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", "")
            )

            # ✅ Логиним пользователя в сессии Django
            login(request, user)

            # ✅ Генерируем JWT токены
            tokens = get_tokens_for_user(user)

            # ✅ Возвращаем всю инфу о пользователе
            return JsonResponse({
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": tokens
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)

def get_products(request):
    products = Product.objects.all()
    return JsonResponse([product.to_dict() for product in products], safe=False)

def get_categories(request):
    categories = Category.objects.all()
    return JsonResponse([category.to_dict() for category in categories], safe=False)

@csrf_exempt
def get_product_details(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return JsonResponse(product.to_dict(), safe=False)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_order(request):
    print(f"📩 Новый заказ от: {request.user}")  # Логирование юзера

    data = request.data  # Получаем JSON из запроса

    if not data.get("items"):
        return Response({"error": "Корзина пуста"}, status=400)

    try:
        with transaction.atomic():  # ✅ Транзакция для целостности
            # Создание заказа
            order = Order.objects.create(
                user=request.user,
                total_price=data.get("total_price", 0.0),
                payment_method=data.get("payment_method", "credit-card"),
            )

            # Добавление товаров в заказ
            order_items = []
            for item in data["items"]:
                product = Product.objects.get(id=item["product_id"])
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item["quantity"],
                    selected_color=item.get("selected_color"),
                    selected_size=item.get("selected_size"),
                )
                order_items.append(order_item)

            # Создание информации о доставке
            shipping = data.get("shipping", {})
            shipping_info = ShippingInfo.objects.create(
                order=order,
                first_name=shipping.get("first_name", ""),
                last_name=shipping.get("last_name", ""),
                email=shipping.get("email", ""),
                phone=shipping.get("phone", ""),
                address=shipping.get("address", ""),
                city=shipping.get("city", ""),
                state=shipping.get("state", ""),
                zip_code=shipping.get("zip_code", ""),
                country=shipping.get("country", "Kazakhstan"),
            )

        # Готовим JSON-ответ
        response_data = {
            "id": order.id,
            "user": order.user.id,
            "payment_method": order.payment_method,
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product.id,
                    "quantity": item.quantity,
                    "selected_color": item.selected_color,
                    "selected_size": item.selected_size,
                }
                for item in order_items
            ],
            "shipping_info": {
                "id": shipping_info.id,
                "first_name": shipping_info.first_name,
                "last_name": shipping_info.last_name,
                "email": shipping_info.email,
                "phone": shipping_info.phone,
                "address": shipping_info.address,
                "city": shipping_info.city,
                "state": shipping_info.state,
                "zip_code": shipping_info.zip_code,
                "country": shipping_info.country,
            },
        }

        return Response(response_data, status=201)

    except Product.DoesNotExist:
        return Response({"error": "Один из продуктов не найден"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order(request):
    print("Получен запрос от:", request.user)

    orders = Order.objects.filter(user=request.user).prefetch_related("items__product", "shipping_info")

    order_data = []
    for order in orders:
        shipping_info = order.shipping_info.first()  # ✅ Берем первый объект, если есть

        order_data.append({
            "id": order.id,
            "date": order.created_at.strftime("%B %d, %Y"),
            "status": order.status,
            "total": float(order.total_price),
            "paymentMethod": order.payment_method,
            "shippingInfo": {
                "first_name": shipping_info.first_name,
                "last_name": shipping_info.last_name,
                "email": shipping_info.email,
                "phone": shipping_info.phone,
                "address": shipping_info.address,
                "city": shipping_info.city,
                "state": shipping_info.state,
                "zip_code": shipping_info.zip_code,
                "country": shipping_info.country,
            } if shipping_info else None,  # ✅ Проверка, если доставки нет
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product.id,
                    "name": item.product.name,
                    "price": float(item.product.price),
                    "quantity": item.quantity,
                    "selected_color": item.selected_color,
                    "selected_size": item.selected_size,
                    "image": getattr(item.product, "image_url", None),  # ✅ Безопасная проверка
                }
                for item in order.items.all()
            ],
        })

    return Response(order_data, status=status.HTTP_200_OK)

def get_review(request, product_id):
    reviews = Review.objects.filter(product_id=product_id)
    return JsonResponse([review.to_dict() for review in reviews], safe=False)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_review(request, product_id):

    data = json.loads(request.body)
    rating = data.get("rating")
    text = data.get("text")

    user = request.user

    # Проверяем, существует ли продукт
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    # Проверяем, оставлял ли пользователь уже отзыв на этот товар
    if Review.objects.filter(product=product, user=user).exists():
        return JsonResponse({"error": "You have already submitted a review for this product."}, status=403)

    # Создаём новый отзыв
    review = Review.objects.create(
        product=product,
        user=user,
        rating=rating,
        text=text
    )

    return JsonResponse({
        "message": "Review submitted successfully",
        "review": {
            "id": review.id,
            "user": user.username,
            "rating": review.rating,
            "text": review.text,
            "helpful_count": review.helpful_count,
            "created_at": review.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
    }, status=201)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    data = request.data
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_password or not new_password:
        return Response({'error': 'Текущий и новый пароли обязательны'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({'error': 'Неверный текущий пароль'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Пароль успешно обновлен'}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def get_profile_picture(request):
    default_image_url = '/media/profile_pics/default.jpg'
    try:
        profile = request.user.profile  # thanks to related_name='profile'
        image_url = profile.image.url if profile.image else default_image_url
    except ProfilePicture.DoesNotExist:
        image_url = default_image_url

    return JsonResponse({
            "user_id": request.user.id,
            "image": image_url
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_picture(request):
    user = request.user
    image_file = request.FILES.get("image")

    if not image_file:
        return JsonResponse({"error": "Изображение не отправлено"}, status=400)

    profile, created = ProfilePicture.objects.get_or_create(user=user)
    profile.image = image_file
    profile.save()

    return JsonResponse({
        "message": "Аватар успешно загружен",
        "user_id": user.id,
        "image": profile.image.url
    }, status=200)
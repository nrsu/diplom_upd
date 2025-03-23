from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.shortcuts import get_object_or_404


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

def get_product_details(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return JsonResponse(product.to_dict(), safe=False)
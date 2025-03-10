from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

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
            if auth_user is not None:
                login(request, auth_user)
                tokens = get_tokens_for_user(auth_user)
                return JsonResponse({"message": "Login successful", "user": auth_user.username, "tokens": tokens})
            
            return JsonResponse({"error": "Invalid credentials"}, status=400)

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

            tokens = get_tokens_for_user(user)

            return JsonResponse({"message": "User created successfully", "user": user.username, "tokens": tokens})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)

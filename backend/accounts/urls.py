from django.urls import path
from .views import *

urlpatterns = [
    path("login/", login_view, name="login"),
    path("signup/", signup_view, name="signup"),
    path("user-details/", get_user_details, name="user-details"),
    path("user-details/<str:username>/", update_user_details, name="user-details"),
    path("products/", get_products, name="get-products"),
    path("categories/", get_categories, name="get-categories"),
    path("product_details/<str:product_id>/", get_product_details, name="product-details"),
    path("order/create/", post_order, name="post-order"),
    path("order/", get_order, name="get-order")
]

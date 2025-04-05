from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
        }


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)  # Используем ImageField
    colors = models.JSONField()
    sizes = models.JSONField()
    description = models.TextField(default="test")
    dimensions = models.TextField(default="test")
    materials = models.TextField(default="test")
    in_the_box = models.TextField(default="test")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.discount:  # Проверяем, есть ли скидка
            self.price = self.original_price * (Decimal(1) - Decimal(self.discount) / Decimal(100))
        else:
            self.price = self.original_price  # Если скидки нет, цена остается оригинальной
        super().save(*args, **kwargs)

    def to_dict(self):
        """Возвращает данные о продукте с учетом скидки."""
        product_data = {
            "id": self.id,
            "name": self.name,
            "category": self.category.name,
            "price": float(self.price) if self.price is not None else None,
            #"isDiscount": self.discount > 0,
            "image": self.image.url if self.image else None,
            "colors": self.colors,
            "sizes": self.sizes,
            "description": self.description,
            "dimensions": self.dimensions,
            "materials": self.materials,
            "in_the_box": self.in_the_box,
        }

        if self.discount > 0:
            product_data["originalPrice"] = float(self.original_price)
            product_data["discount"] = self.discount

        return product_data

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return {
            "user": self.user,
            "payment_method": self.payment_method,
            "total_price": self.total_price,
            "status": self.status,
            "created_at": self.created_at
        }

class ShippingInfo(models.Model):
    order = models.ForeignKey(Order, related_name='shipping_info', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='Kazakhstan')

    def to_dict(self):
        return{
            "order": self.order,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country
        }

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    selected_color = models.CharField(max_length=50, blank=True, null=True)
    selected_size = models.CharField(max_length=50, blank=True, null=True)

    def to_dict(self):
        return{
            "order": self.order,
            "product": self.product,
            "quantity": self.quantity,
            "selected_color": self.selected_color,
            "selected_size": self.selected_size
        }

class Review(models.Model):
    product = models.ForeignKey('Product', related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    text = models.TextField()
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product.id,
            "user_name": self.user.first_name + " " + self.user.last_name,
            "user_avatar": "/placeholder.svg?height=40&width=40",  # Можно заменить на реальный URL
            "rating": self.rating,
            "date": self.created_at.strftime("%Y-%m-%d"),
            "text": self.text,
            "helpful_count": self.helpful_count,
        }
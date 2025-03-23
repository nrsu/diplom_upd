from django.db import models
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

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
    description = models.TextField()

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
        }

        if self.discount > 0:
            product_data["originalPrice"] = float(self.original_price)
            product_data["discount"] = self.discount

        return product_data

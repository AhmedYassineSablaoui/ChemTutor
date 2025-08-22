from django.db import models
from django.contrib.auth.models import User  # If using auth later

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  # Optional for anon sessions
    session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.session_id

class QueryHistory(models.Model):
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    query_text = models.TextField()
    response_text = models.TextField()
    feature = models.CharField(max_length=50)  # e.g., 'formatter', 'qa'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.feature}: {self.query_text[:50]}"


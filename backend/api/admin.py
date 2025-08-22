from django.contrib import admin
from .models import UserSession, QueryHistory

admin.site.register(UserSession)
admin.site.register(QueryHistory)

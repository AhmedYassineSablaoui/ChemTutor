"""
Test settings for chemtutor project.
"""

from .settings import *
import os

# Override settings for testing
SECRET_KEY = 'test-secret-key-for-testing-only'
DEBUG = True
ALLOWED_HOSTS = ['*']

# Use in-memory database for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Disable logging during tests
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'root': {
        'handlers': ['null'],
    },
}

# Disable cache during tests
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Disable email sending during tests
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Test-specific settings
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable CORS for tests
CORS_ALLOW_ALL_ORIGINS = True

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended user profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    institution = models.CharField(max_length=255, blank=True, null=True)
    education_level = models.CharField(max_length=100, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"Profile: {self.user.username}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Automatically create a profile when a new user is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile when the user is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


class LoginHistory(models.Model):
    """Track user login attempts and sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    session_token = models.CharField(max_length=255, blank=True, null=True)
    is_successful = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'login_history'
        verbose_name = 'Login History'
        verbose_name_plural = 'Login Histories'
        ordering = ['-login_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.login_time.strftime('%Y-%m-%d %H:%M:%S')}"


class ReactionFormatter(models.Model):
    """Store all reaction balancing and formatting requests"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reactions')
    input_reaction = models.TextField()
    balanced_reaction = models.TextField(blank=True, null=True)
    reactants = models.JSONField(blank=True, null=True)
    products = models.JSONField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    is_successful = models.BooleanField(default=True)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reaction_formatter'
        verbose_name = 'Reaction Formatter'
        verbose_name_plural = 'Reaction Formatters'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.input_reaction[:50]} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class QAHistory(models.Model):
    """Store all Q&A interactions"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='qa_history')
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    sources = models.JSONField(blank=True, null=True)
    is_successful = models.BooleanField(default=True)
    error_message = models.TextField(blank=True, null=True)
    response_time = models.FloatField(null=True, blank=True)  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'qa_history'
        verbose_name = 'Q&A History'
        verbose_name_plural = 'Q&A Histories'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Q: {self.question[:50]} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class CorrectionHistory(models.Model):
    """Store all correction requests"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='corrections')
    original_statement = models.TextField()
    corrected_statement = models.TextField(blank=True, null=True)
    was_changed = models.BooleanField(default=False)
    is_successful = models.BooleanField(default=True)
    error_message = models.TextField(blank=True, null=True)
    response_time = models.FloatField(null=True, blank=True)  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'correction_history'
        verbose_name = 'Correction History'
        verbose_name_plural = 'Correction Histories'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Original: {self.original_statement[:50]} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


# Keep legacy models for backward compatibility
class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.session_id


class QueryHistory(models.Model):
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    query_text = models.TextField()
    response_text = models.TextField()
    feature = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.feature}: {self.query_text[:50]}"


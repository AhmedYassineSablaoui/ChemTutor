from django.contrib import admin
from .models import (
    UserProfile, LoginHistory, ReactionFormatter, 
    QAHistory, CorrectionHistory, UserSession, QueryHistory
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'education_level', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'institution')
    list_filter = ('education_level', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Profile Details', {
            'fields': ('bio', 'institution', 'education_level', 'avatar_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_time', 'logout_time', 'ip_address', 'is_successful')
    search_fields = ('user__username', 'ip_address', 'user_agent')
    list_filter = ('is_successful', 'login_time')
    readonly_fields = ('login_time', 'logout_time', 'ip_address', 'user_agent', 'session_token')
    date_hierarchy = 'login_time'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ReactionFormatter)
class ReactionFormatterAdmin(admin.ModelAdmin):
    list_display = ('input_reaction_short', 'user', 'is_successful', 'created_at')
    search_fields = ('input_reaction', 'balanced_reaction', 'user__username')
    list_filter = ('is_successful', 'created_at')
    readonly_fields = ('user', 'input_reaction', 'balanced_reaction', 'reactants', 
                       'products', 'metadata', 'is_successful', 'error_message', 'created_at')
    date_hierarchy = 'created_at'
    
    def input_reaction_short(self, obj):
        return obj.input_reaction[:50] + '...' if len(obj.input_reaction) > 50 else obj.input_reaction
    input_reaction_short.short_description = 'Input Reaction'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(QAHistory)
class QAHistoryAdmin(admin.ModelAdmin):
    list_display = ('question_short', 'user', 'is_successful', 'response_time', 'created_at')
    search_fields = ('question', 'answer', 'user__username')
    list_filter = ('is_successful', 'created_at')
    readonly_fields = ('user', 'question', 'answer', 'sources', 'is_successful', 
                       'error_message', 'response_time', 'created_at')
    date_hierarchy = 'created_at'
    
    def question_short(self, obj):
        return obj.question[:50] + '...' if len(obj.question) > 50 else obj.question
    question_short.short_description = 'Question'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(CorrectionHistory)
class CorrectionHistoryAdmin(admin.ModelAdmin):
    list_display = ('original_short', 'user', 'was_changed', 'is_successful', 'response_time', 'created_at')
    search_fields = ('original_statement', 'corrected_statement', 'user__username')
    list_filter = ('is_successful', 'was_changed', 'created_at')
    readonly_fields = ('user', 'original_statement', 'corrected_statement', 'was_changed',
                       'is_successful', 'error_message', 'response_time', 'created_at')
    date_hierarchy = 'created_at'
    
    def original_short(self, obj):
        return obj.original_statement[:50] + '...' if len(obj.original_statement) > 50 else obj.original_statement
    original_short.short_description = 'Original Statement'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


# Legacy models
admin.site.register(UserSession)
admin.site.register(QueryHistory)

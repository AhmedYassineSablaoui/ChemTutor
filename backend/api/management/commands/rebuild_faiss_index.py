from django.core.management.base import BaseCommand
from api.services.retrieval_service import RetrievalService

class Command(BaseCommand):
    help = "Rebuild the FAISS index for document retrieval"

    def handle(self, *args, **options):
        self.stdout.write("🔄 Rebuilding FAISS index...")
        service = RetrievalService()
        service.rebuild_faiss_index()
        self.stdout.write(self.style.SUCCESS("✅ FAISS index rebuilt successfully!"))

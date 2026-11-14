"""Vercel Serverless Function entry point for Cancer Strategy Monitor (Vahti UI).

Routes:
  GET  /api/status
  GET  /api/data/status
  GET  /api/data
  GET  /api/report?id=...
  POST /api/chat
"""
import os
import sys

API_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(API_DIR, '..'))
VAHTI_DIR = os.path.join(PROJECT_ROOT, 'vahti-ui')

if VAHTI_DIR not in sys.path:
    sys.path.insert(0, VAHTI_DIR)

from server import H


class handler(H):
    """Vercel standard serverless HTTP handler."""

    def log_message(self, format, *args):
        # Clean production logging
        pass

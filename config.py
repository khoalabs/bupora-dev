import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY', 'test') # openssl rand -hex 32 (linux)
  API_KEY = os.environ.get('API_KEY', 'admin')
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f"postgresql://app:{os.environ.get('DATABASE_PWD', 'test')}@localhost:5432/site")
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  SQLALCHEMY_ENGINE_OPTIONS = {'pool_pre_ping': True}
  SESSION_COOKIE_SECURE = True
  SESSION_COOKIE_HTTPONLY = True

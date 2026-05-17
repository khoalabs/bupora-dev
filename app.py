import re, datetime
from flask import Flask, Blueprint, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
api = Blueprint('api', __name__)

# ======================
# CONFIG
# ======================

# ======================
# UTILS
# ======================
def slugify(text):
  text = text.lower()
  text = re.sub(r'[^a-z0-9]+', '-', text)
  text = text.strip('-')
  return text

# ======================
# DATABASE
# ======================

# ======================
# MODELS
# ======================

class Breed(db.Model):
  __tablename__ = 'breeds'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(120), nullable=False)
  slug = db.Column(db.String(120), unique=True, index=True)
  description = db.Column(db.Text)
  created_at = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))

class Post(db.Model):
  __tablename__ = 'posts'
  __table_args__ = (db.Index('idx_category', 'category'),)
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(200), nullable=False)
  slug = db.Column(db.String(200), unique=True, index=True)
  content = db.Column(db.Text)
  breed_id = db.Column(db.Integer, db.ForeignKey('breeds.id'), nullable=True)
  category = db.Column(db.String(50))
  published = db.Column(db.Boolean, default=True)
  created_at = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
  updated_at = db.Column(db.DateTime, onupdate=datetime.datetime.now(datetime.timezone.utc))
  breed = db.relationship('Breed', backref='posts')

# ======================
# SECURITY
# ======================

# ======================
# ROUTES
# ======================
@app.route('/')
def index():
  posts = Post.query.order_by(Post.created_at.desc()).limit(10).all()
  return render_template('index.html', posts=posts)

@app.route('/breeds')
def breeds():
  breeds = Breed.query.all()
  return jsonify([
    {'name': b.name, 'slug': b.slug}
    for b in breeds
  ])

@app.route('/breeds/<slug>')
def breed_detail(slug):

  breed = Breed.query.filter_by(slug=slug).first_or_404()

  posts = Post.query.filter_by(
    breed_id=breed.id,
    published=True
  ).all()

  return jsonify({
    'breed': breed.name,
    'posts': [p.title for p in posts]
  })

@app.route('/care')
def care():

  posts = Post.query.filter_by(
    category='care',
    published=True
  ).all()

  return jsonify([
    {'title': p.title, 'slug': p.slug}
    for p in posts
  ])

@app.route('/post/<slug>')
def post(slug):
  
  # post = Post.query.filter_by(slug=slug, published=True).first_or_404()

  # return render_template('post.html', post=post)
  post = {
    "title": "How to Choose the Right Dog Breed",
    "slug": slug,
    "created_at": datetime.datetime(2026,2,20),
    "updated_at": datetime.datetime(2026,3,1)
  }
  return render_template('post.html', post=post)

# ======================
# ADMIN API
# ======================
@api.route('/api/post', methods=['POST'])
def api_create_post():
  if request.headers.get('X-API-KEY') != app.config['API_KEY']:
    return jsonify({'error': 'unauthorized'}), 401
  data = request.get_json()
  post = Post(
    title=data['title'],
    slug=slugify(data['title']),
    content=data['content'],
    category=data.get('category'),
    breed_id=data.get('breed_id'),
    published=True
  )
  db.session.add(post)
  db.session.commit()

  return jsonify({'status': 'ok'})

@api.route('/api/breed', methods=['POST'])
def api_create_breed():
  if request.headers.get('X-API-KEY') != app.config['API_KEY']:
    return jsonify({'error': 'unauthorized'}), 401
  data = request.get_json()
  breed = Breed(
    name=data['name'],
    slug=slugify(data['name']),
    description=data.get('description')
  )
  db.session.add(breed)
  db.session.commit()
  return jsonify({'status': 'ok'})

app.register_blueprint(api)

if __name__ == '__main__':
  with app.app_context():
    db.create_all()
  app.run(host='127.0.0.1', port=5000, debug=True)
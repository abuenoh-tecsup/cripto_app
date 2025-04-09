¡Perfecto! Con base en todo lo que hiciste, aquí tienes un `README.md` en formato markdown para que cualquiera pueda clonar y levantar el proyecto Django + DRF + React (Vite):


# 🪙 Cripto App - Django + React

Aplicación fullstack que permite gestionar criptomonedas, billeteras y transacciones. Backend hecho con Django REST Framework y frontend con React + Vite.

---

## 📁 Estructura del proyecto

```bash
cripto_app/
├── config/              # Configuración de Django
├── app/                 # Lógica del backend (models, views, serializers, etc.)
├── client/              # Aplicación frontend en React + Vite
├── manage.py            # CLI de Django
├── requirements.txt     # Dependencias del backend
└── README.md
```

---

## 🚀 Instalación y ejecución

### 🔧 Requisitos previos

- Python 3.10+
- Node.js (v18+ recomendado)
- Git

---

### 🐍 Backend (Django + DRF)

1. Clona el repositorio:

```bash
git clone https://github.com/abuenoh-tecsup/cripto_app.git
cd cripto_app
```

2. Crea un entorno virtual e instálalo:

```bash
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/macOS
```

3. Instala las dependencias de Python:

```bash
pip install -r requirements.txt
```

4. Aplica las migraciones:

```bash
python manage.py migrate
```

5. Si tienes un comando de seed personalizado (como en este caso):

```bash
python manage.py seed
```

6. Crea un superusuario (opcional):

```bash
python manage.py createsuperuser
```

7. Corre el servidor de desarrollo:

```bash
python manage.py runserver
```

- API disponible en: http://127.0.0.1:8000/app/api/

---

### ⚛️ Frontend (React + Vite)

1. Ve al directorio `client`:

```bash
cd client
```

2. Instala las dependencias:

```bash
npm install
```

> ⚠️ Algunos paquetes pueden estar obsoletos o mostrar advertencias. Revisa y actualiza si es necesario.

3. Corre el servidor de desarrollo:

```bash
npm run dev
```

- Frontend disponible en: http://localhost:5173/

---

## 📦 Endpoints principales (DRF)

| Endpoint                  | Método | Descripción                         |
|--------------------------|--------|-------------------------------------|
| `/app/api/currencies/`   | GET    | Lista de criptomonedas              |
| `/app/api/wallets/`      | GET    | Billeteras registradas              |
| `/app/api/transactions/` | GET    | Historial de transacciones          |

---

## 🛠️ Tecnologías usadas

- **Backend:** Django 5.1.7, DRF, django-cors-headers
- **Frontend:** React, Vite, TailwindCSS
- **Base de datos:** SQLite (por defecto)

---

## ✅ Notas

- El comando `python manage.py seed` siembra criptomonedas iniciales.
- Usa `.env` si necesitas variables de entorno sensibles (no incluido por defecto).
- Para producción, considera usar PostgreSQL, nginx, Docker, etc.

---

-- ============================================================
-- MI COMPLI — Datos de prueba
-- Ejecutar después de 001_schema_inicial.sql
-- ============================================================

-- ─── EXPERIENCIAS ───────────────────────────────────────────

insert into experiencias (nombre, descripcion, categoria, precio_base, emoji) values
  ('Bouquet de rosas premium',     'Arreglo floral de 24 rosas con tarjeta personalizada y caja elegante.',                     'regalo',      650,  '🌹'),
  ('Caja de chocolates artesanal', 'Selección curada de 18 chocolates belgas con mensaje manuscrito.',                           'regalo',      480,  '🍫'),
  ('Peluche + globo + detalle',    'Un set completo para hacer sonreír. Ideal para cualquier ocasión especial.',                  'regalo',      390,  '🧸'),
  ('Cena romántica',               'Reservación privada con decoración de velas, menú especial y múltiples cómplices coordinados.','experiencia', 1200, '🍷'),
  ('Desayuno sorpresa a domicilio','Llegamos a su puerta con un desayuno completo, decoración y un detalle especial.',            'experiencia',  780,  '🌅'),
  ('Reconciliación perfecta',      'Lo más difícil es dar el primer paso. Nosotros lo hacemos memorable y sin fricción.',        'experiencia',  950,  '💌');

-- ─── UBICACIONES (para experiencias) ────────────────────────

-- Cena romántica
with exp as (select id from experiencias where nombre = 'Cena romántica')
insert into ubicaciones (experiencia_id, nombre, precio_extra) values
  ((select id from exp), 'La Trattoria', 0),
  ((select id from exp), 'Rooftop 360',  200),
  ((select id from exp), 'Jardín secreto', 150),
  ((select id from exp), 'En casa',       100);

-- Desayuno sorpresa
with exp as (select id from experiencias where nombre = 'Desayuno sorpresa a domicilio')
insert into ubicaciones (experiencia_id, nombre, precio_extra) values
  ((select id from exp), 'Su domicilio', 0),
  ((select id from exp), 'Hotel',        150),
  ((select id from exp), 'Oficina',      100);

-- Reconciliación
with exp as (select id from experiencias where nombre = 'Reconciliación perfecta')
insert into ubicaciones (experiencia_id, nombre, precio_extra) values
  ((select id from exp), 'Lugar especial',  0),
  ((select id from exp), 'Parque favorito', 0),
  ((select id from exp), 'Restaurante',     200);

-- ─── AMBIENTES MUSICALES ────────────────────────────────────

with exp as (select id from experiencias where nombre = 'Cena romántica')
insert into ambientes_musicales (experiencia_id, nombre, precio_extra) values
  ((select id from exp), 'Jazz suave',      0),
  ((select id from exp), 'Clásica',         0),
  ((select id from exp), 'Bossa nova',      0),
  ((select id from exp), 'Playlist romántica', 0);

with exp as (select id from experiencias where nombre = 'Reconciliación perfecta')
insert into ambientes_musicales (experiencia_id, nombre, precio_extra) values
  ((select id from exp), 'Sin música',  0),
  ((select id from exp), 'Su canción', 150);

-- ─── ADDONS ─────────────────────────────────────────────────

-- Cena romántica
with exp as (select id from experiencias where nombre = 'Cena romántica')
insert into addons (experiencia_id, nombre, precio, emoji) values
  ((select id from exp), 'Pastel personalizado', 350, '🎂'),
  ((select id from exp), 'Fotógrafo',            600, '📸'),
  ((select id from exp), 'Arreglo floral',       280, '💐'),
  ((select id from exp), 'Violinista en vivo',   800, '🎻'),
  ((select id from exp), 'Champagne',            250, '🫧'),
  ((select id from exp), 'Carta manuscrita',     120, '✉️');

-- Desayuno sorpresa
with exp as (select id from experiencias where nombre = 'Desayuno sorpresa a domicilio')
insert into addons (experiencia_id, nombre, precio, emoji) values
  ((select id from exp), 'Rosas',         180, '🌹'),
  ((select id from exp), 'Globos',         80, '🎈'),
  ((select id from exp), 'Fotógrafo',     600, '📸'),
  ((select id from exp), 'Pastel chico',  200, '🎂');

-- Reconciliación
with exp as (select id from experiencias where nombre = 'Reconciliación perfecta')
insert into addons (experiencia_id, nombre, precio, emoji) values
  ((select id from exp), 'Arreglo floral', 280, '🌹'),
  ((select id from exp), 'Carta curada',   150, '✉️'),
  ((select id from exp), 'Vino tinto',     200, '🍷'),
  ((select id from exp), 'Foto del momento', 400, '📸');

CREATE TABLE "Usuario"(
    "idUsuario" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "rol" VARCHAR(255) NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE "Usuario" ADD PRIMARY KEY("idUsuario");
ALTER TABLE "Usuario" ADD CONSTRAINT "usuario_mail_unique" UNIQUE("mail");

CREATE TYPE estado_tarea AS ENUM('pendiente', 'en_progreso', 'completada', 'cancelada');

CREATE TABLE "Tablon"(
    "idTabla" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "dueno" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE "Tablon" ADD PRIMARY KEY("idTabla");
ALTER TABLE "Tablon" ADD CONSTRAINT "tablon_dueno_foreign" FOREIGN KEY("dueno") REFERENCES "Usuario"("idUsuario");

CREATE TABLE "Tarea"(
    "id_tarea" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "estado" estado_tarea NOT NULL DEFAULT 'pendiente',
    "usuario_asignado" INTEGER NOT NULL,
    "id_tablero" INTEGER NOT NULL
);
ALTER TABLE "Tarea" ADD PRIMARY KEY("id_tarea");
ALTER TABLE "Tarea" ADD CONSTRAINT "tarea_usuario_asignado_foreign" FOREIGN KEY("usuario_asignado") REFERENCES "Usuario"("idUsuario");
ALTER TABLE "Tarea" ADD CONSTRAINT "tarea_id_tablero_foreign" FOREIGN KEY("id_tablero") REFERENCES "Tablon"("idTabla");

CREATE TABLE "UsuarioTablero"(
    "idUsuarioTablero" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tablero" INTEGER NOT NULL
);
ALTER TABLE "UsuarioTablero" ADD PRIMARY KEY("idUsuarioTablero");
ALTER TABLE "UsuarioTablero" ADD CONSTRAINT "usuariotablero_idusuario_foreign" FOREIGN KEY("id_usuario") REFERENCES "Usuario"("idUsuario");
ALTER TABLE "UsuarioTablero" ADD CONSTRAINT "usuariotablero_idtablero_foreign" FOREIGN KEY("id_tablero") REFERENCES "Tablon"("idTabla");
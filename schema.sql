drop database nlgdw;

CREATE DATABASE IF NOT EXISTS nlgdw;
USE nlgdw;

CREATE TABLE vendedoras(
	id_Vendedora INT AUTO_INCREMENT PRIMARY KEY,
    nombreVendedora varchar(35) not null,
    telefonoVendedora varchar(15),
    correo varchar(120) not null unique,
    contrasena varchar(200) not null,
    rol enum('admin','editor','usuario') not null default 'usuario',
    
    -- Confirmación de cuenta
    token VARCHAR(100),
    confirmado TINYINT(1) DEFAULT 0
);

CREATE TABLE citas(
	id_Cita INT AUTO_INCREMENT PRIMARY KEY,
    nombreCliente varchar(100) not null,
    telefonoCliente varchar(15) not null,
    codigoVestido varchar(25),
    fechaEvento date not null,
    medidasCita date ,
    entregasCita date,
    hora time not null,
    id_Vendedora int,
    foreign key(id_Vendedora) references vendedoras(id_Vendedora)
);

alter table vendedoras add column token_recuperacion varchar(100);
alter table vendedoras add column token_expiracion datetime;
import React, { useState, useRef, useEffect } from 'react';
import '../../assets/style/users/FormRegistro.css';
import { addUser } from '../../data/user';

// Lista de regiones (constante local)
// Se usa como fuente para el desplegable de regiones
const Rregiones = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
    'Valparaíso', 'Región Metropolitana', "O'Higgins", 'Maule', 'Ñuble',
    'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
];

// Estado inicial del formulario
// Campos controlados por useState
const initialState = {
    nombre: '',
    apellido: '',
    correo: '',
    region: '',
    password: '',
    password2: ''
};

// Función de validación local
// Recibe formData y devuelve un objeto con errores por campo
// (clave = nombre del campo, valor = mensaje de error)
const ValidarFormularioRegistro = (formData) => {
    const errores = {};

    if (!formData || !formData.nombre || !formData.nombre.trim()) {
        errores.nombre = 'Por favor ingrese nombre';
    }

    if (!formData || !formData.apellido || !formData.apellido.trim()) {
        errores.apellido = 'Por favor ingrese apellido';
    }

    if (!formData || !formData.correo || !formData.correo.trim()) {
        errores.correo = 'Por favor ingrese correo';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
        errores.correo = 'Correo inválido';
    }

    if (!formData || !formData.region) {
        errores.region = 'Por favor seleccione región';
    }

    if (!formData || !formData.password) {
        errores.password = 'Por favor ingrese contraseña';
    }

    if (!formData || !formData.password2) {
        errores.password2 = 'Repita contraseña';
    } else if (formData.password !== formData.password2) {
        errores.password2 = 'Las contraseñas no coinciden';
    }

    return errores;
};

const FormRegistro = () => {
    // Estado del formulario (valores de los inputs)
    const [formData, setFormData] = useState(initialState);
    // Errores por campo (objeto con keys por cada campo con error)
    const [errores, setErrores] = useState({});

    // Manejador de cambios para inputs controlados
    // Actualiza el campo correspondiente en formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Submit del formulario
    // Valida y setea errores; si no hay errores se puede enviar al backend
    const handleSubmit = (e) => {
        e.preventDefault();
        const erroresValidados = ValidarFormularioRegistro(formData);
        setErrores(erroresValidados);

        if (Object.keys(erroresValidados).length === 0) {
            // Guardar usuario usando la utilidad addUser (persiste en localStorage)
            const nombreCompleto = `${formData.nombre} ${formData.apellido}`.trim();
            const newUser = addUser({ name: nombreCompleto, email: formData.correo, password: formData.password });
            console.log('Usuario registrado:', newUser);
            // reset del formulario y mostrar un mensaje sencillo
            setFormData(initialState);
            setErrores({});
            alert('Registro exitoso. Ahora puedes iniciar sesión con tu correo y contraseña.');
        }
    };

    return (
        <div className="registro-frame registro-container">
            <div className="registro-title">Registro</div>
            <form onSubmit={handleSubmit} noValidate>
                
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <div className="input-with-overlay">
                        <input
                            id="nombre"
                            type="text"
                            placeholder="Ingrese su nombre"
                            className={`form-control registro-input ${errores.nombre ? 'is-invalid' : ''}`}
                            aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                        
                            {errores.nombre && !formData.nombre && (
                            <span className="input-error-overlay">{errores.nombre}</span>
                        )}
                    </div>
                    
                    <div id="error-nombre" role="alert" className="invalid-feedback">{errores.nombre}</div>
                </div>

                
                <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <div className="input-with-overlay">
                        <input
                            id="apellido"
                            type="text"
                            placeholder="Ingrese su apellido"
                            className={`form-control registro-input ${errores.apellido ? 'is-invalid' : ''}`}
                            aria-describedby={errores.apellido ? 'error-apellido' : undefined}
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                        />
                        {errores.apellido && !formData.apellido && (
                            <span className="input-error-overlay">{errores.apellido}</span>
                        )}
                    </div>
                    <div id="error-apellido" role="alert" className="invalid-feedback">{errores.apellido}</div>
                </div>

                
                <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo</label>
                    <div className="input-with-overlay">
                        <input
                            id="correo"
                            type="email"
                            placeholder="Ingrese su correo"
                            className={`form-control registro-input ${errores.correo ? 'is-invalid' : ''}`}
                            aria-describedby={errores.correo ? 'error-correo' : undefined}
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                        />
                        {errores.correo && !formData.correo && (
                            <span className="input-error-overlay">{errores.correo}</span>
                        )}
                    </div>
                    <div id="error-correo" role="alert" className="invalid-feedback">{errores.correo}</div>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="region" className="form-label">Región</label>
                    <div className="input-group">
                        
                        <CustomRegionSelect
                            regiones={Rregiones}
                            value={formData.region}
                            onChange={(val) => {
                                setFormData(prev => ({ ...prev, region: val }));
                                // clear error for region when user chooses
                                setErrores(prev => ({ ...prev, region: undefined }));
                            }}
                            error={errores.region}
                        />
                    </div>
                    <div id="error-region" role="alert" className="invalid-feedback">{errores.region}</div>
                </div>

                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-with-overlay">
                        <input
                            id="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            className={`form-control registro-input ${errores.password ? 'is-invalid' : ''}`}
                            aria-describedby={errores.password ? 'error-password' : undefined}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errores.password && !formData.password && (
                            <span className="input-error-overlay">{errores.password}</span>
                        )}
                    </div>
                    <div id="error-password" role="alert" className="invalid-feedback">{errores.password}</div>
                </div>

                
                <div className="mb-3">
                    <label htmlFor="password2" className="form-label">Confirmar Contraseña</label>
                    <div className="input-with-overlay">
                        <input
                            id="password2"
                            type="password"
                            placeholder="Repita su contraseña"
                            className={`form-control registro-input ${errores.password2 ? 'is-invalid' : ''}`}
                            aria-describedby={errores.password2 ? 'error-password2' : undefined}
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                        />
                        {errores.password2 && !formData.password2 && (
                            <span className="input-error-overlay">{errores.password2}</span>
                        )}
                    </div>
                    <div id="error-password2" role="alert" className="invalid-feedback">{errores.password2}</div>
                </div>

                <button type="submit" className="btn-registro-submit">Registrarse</button>
            </form>
        </div>
    );
};

export default FormRegistro;


function CustomRegionSelect({ regiones, value, onChange, error }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`custom-region-select ${error ? 'has-error' : ''}`} ref={ref}>
            <button type="button" className="btn-region" onClick={() => setOpen(o => !o)}>
                Región ▾
            </button>
            <div className="custom-select-display" onClick={() => setOpen(o => !o)}>
                {value || 'Seleccione región'}
            </div>
            {open && (
                <div className="custom-select-menu">
                    <ul>
                        {regiones.map(r => (
                            <li key={r} onClick={() => { onChange(r); setOpen(false); }}>
                                {r}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


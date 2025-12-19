import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Moon, 
  Sun, 
  Image as ImageIcon,
  Trash2,
  Check,
  CheckCheck,
  User,
  Mail,
  ArrowRight,
  ShoppingBag,
  Star
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const BOT_INFO = {
  nombre: "Nexus AI",
  estado: "En línea",
};

const FONDOS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2128&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1490682143684-14369e18dce8?q=80&w=2070&auto=format&fit=crop", 
  "default"
];

const TAGS_SUGERIDOS = ["Ver Catálogo", "Soporte", "Horarios", "Ubicación"];

const PRODUCTOS = [
  { id: 1, nombre: "Auriculares Pro", precio: "$299", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60", rating: 4.8 },
  { id: 2, nombre: "Smartwatch X", precio: "$199", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", rating: 4.5 },
  { id: 3, nombre: "Cámara 4K", precio: "$599", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60", rating: 4.9 },
];

// --- COMPONENTE VISUAL: ESFERA "SHARP FLUID" (Versión Final) ---
const AIOrb = ({ sizeClass }) => (
  <div className={`relative flex items-center justify-center ${sizeClass}`}>
    
    <style>{`
      /* Rotación del fluido base (RÁPIDO) */
      @keyframes fluid-spin-1 {
        0% { transform: rotate(0deg) scale(1.4); }
        33% { transform: rotate(120deg) scale(1.6); }
        66% { transform: rotate(240deg) scale(1.4); }
        100% { transform: rotate(360deg) scale(1.4); }
      }
      
      /* Rotación inversa y deformación (RÁPIDO) */
      @keyframes fluid-spin-2 {
        0% { transform: rotate(360deg) scale(1.4) translate(0, 0); }
        50% { transform: rotate(180deg) scale(1.6) translate(10%, 10%); }
        100% { transform: rotate(0deg) scale(1.4) translate(0, 0); }
      }

      /* Movimiento orbital de manchas específicas (RÁPIDO) */
      @keyframes blob-orbit {
        0% { transform: rotate(0deg) translateX(25%) rotate(0deg); }
        100% { transform: rotate(360deg) translateX(25%) rotate(-360deg); }
      }

      @keyframes breathe-core {
        0%, 100% { transform: scale(0.9); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
      }
    `}</style>
    
    {/* 1. AURA AMBIENTAL */}
    <div 
      className="absolute top-[5%] left-[5%] w-[90%] h-[90%] rounded-full opacity-50 blur-[15px]" 
      style={{
        background: 'radial-gradient(circle, #54b6ca, #474ed7)',
        transform: 'translateY(10%)'
      }} 
    />

    {/* 2. CONTENEDOR PRINCIPAL */}
    <div className="absolute inset-0 rounded-full overflow-hidden bg-white shadow-xl transform-gpu z-10 ring-1 ring-white/20">
      
      {/* CAPA 1: EL FONDO PROFUNDO (Azul y Verde) - Velocidad: 4s */}
      <div className="absolute inset-[-100%] top-[-100%] left-[-100%] w-[300%] h-[300%]">
        <div 
          className="absolute inset-0 w-full h-full opacity-90 blur-[15px]" 
          style={{
            background: 'conic-gradient(from 0deg, #474ed7, #00ee6e, #474ed7, #00ee6e, #474ed7)',
            animation: 'fluid-spin-1 4s linear infinite'
          }}
        />
      </div>

      {/* CAPA 2: LA LUZ Y EL CIAN - Velocidad: 6s */}
      <div className="absolute inset-[-100%] top-[-100%] left-[-100%] w-[300%] h-[300%] mix-blend-hard-light">
        <div 
          className="absolute inset-0 w-full h-full opacity-80 blur-[18px]" 
          style={{
            background: 'conic-gradient(from 180deg, #54b6ca, transparent, #aa96f9, transparent, #54b6ca)',
            animation: 'fluid-spin-2 6s ease-in-out infinite'
          }}
        />
      </div>

      {/* CAPA 3: ACENTOS ORBITALES - Velocidad General: 2.5s */}
      <div className="absolute inset-0 animate-[spin_2.5s_linear_infinite]">
         {/* Mancha Lavanda - Velocidad: 2s */}
         <div 
           className="absolute top-[20%] left-[50%] w-[60%] h-[60%] rounded-full bg-[#aa96f9] blur-[12px] opacity-80 mix-blend-multiply" 
           style={{ transformOrigin: '0% 100%', animation: 'blob-orbit 2s linear infinite' }}
         />
         {/* Mancha Verde - Velocidad: 3s */}
         <div 
           className="absolute bottom-[20%] right-[50%] w-[50%] h-[50%] rounded-full bg-[#00ee6e] blur-[10px] opacity-70 mix-blend-color-burn" 
           style={{ transformOrigin: '100% 0%', animation: 'blob-orbit 3s linear infinite reverse' }}
         />
      </div>

      {/* --- DETALLES FINALES --- */}

      {/* Núcleo Blanco Pulsante - Velocidad: 1.5s */}
      <div 
        className="absolute inset-[20%] rounded-full bg-white blur-[8px] opacity-70 mix-blend-overlay"
        style={{ animation: 'breathe-core 1.5s ease-in-out infinite' }}
      />

      {/* Brillo Especular (Glossy) */}
      <div 
        className="absolute top-[-10%] left-[20%] w-[60%] h-[40%] bg-gradient-to-b from-white/90 to-transparent opacity-60 blur-[4px] rounded-full pointer-events-none" 
      />
      
      {/* Sombra Interna Profunda */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_-15px_30px_rgba(71,78,215,0.6)] pointer-events-none" />
      
    </div>
  </div>
);

export default function App() {
  const [paso, setPaso] = useState('login'); 
  const [usuario, setUsuario] = useState({ nombre: '', email: '' });
  
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [indiceFondo, setIndiceFondo] = useState(3);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo, paso]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!usuario.nombre || !usuario.email) return;
    setPaso('cargando');
    setTimeout(() => {
      setPaso('chat');
      setTimeout(() => agregarMensajeBot(`¡Hola ${usuario.nombre}! 👋 Bienvenido a Nexus.`), 600);
      setTimeout(() => agregarMensajeBot("Soy tu asistente personal. ¿En qué puedo innovar hoy?", "pregunta"), 1500);
    }, 2000);
  };

  const agregarMensajeBot = (texto, tipo = "texto", data = null) => {
    setMensajes(prev => [...prev, {
      id: Date.now(),
      texto,
      remitente: "bot",
      tipo,
      data,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estado: "leido"
    }]);
  };

  const enviarMensaje = (textoEnviado) => {
    const textoFinal = typeof textoEnviado === 'string' ? textoEnviado : nuevoMensaje;
    if (!textoFinal.trim()) return;

    const mensajeUsuario = {
      id: Date.now(),
      texto: textoFinal,
      remitente: "yo",
      tipo: "texto",
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estado: "enviado"
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setNuevoMensaje("");
    setEscribiendo(true);

    setTimeout(() => {
      setEscribiendo(false);
      procesarRespuestaInteligente(textoFinal);
    }, 1200);
  };

  const procesarRespuestaInteligente = (input) => {
    const t = input.toLowerCase();
    if (t.includes("catálogo") || t.includes("producto") || t.includes("precio") || t.includes("oferta") || t.includes("ver")) {
      agregarMensajeBot("Analizando inventario... Aquí tienes nuestra selección premium: ✨", "productos", PRODUCTOS);
      return;
    }
    if (t.includes("soporte") || t.includes("ayuda")) {
      agregarMensajeBot("Conectando con un especialista. Recibirás asistencia en " + usuario.email + ".");
      return;
    }
    if (t.includes("hola")) {
      agregarMensajeBot("Sistemas operativos. ¿Cómo puedo asistirte hoy?");
      return;
    }
    agregarMensajeBot("Procesando solicitud. ¿Necesitas detalles técnicos específicos?");
  };

  const bgApp = temaOscuro ? "bg-[#0f172a]" : "bg-[#f0f2f5]";
  const bgCard = temaOscuro ? "bg-[#1e293b]" : "bg-white";
  const txtPrincipal = temaOscuro ? "text-white" : "text-gray-800";
  const txtSecundario = temaOscuro ? "text-slate-400" : "text-gray-500";
  const accentColor = "bg-indigo-600";
  const accentHover = "hover:bg-indigo-700";

  const fondoUrl = FONDOS[indiceFondo];
  const estiloFondo = fondoUrl !== "default"
    ? { backgroundImage: `url(${fondoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: temaOscuro ? '#0f172a' : '#e5e5f7' };
  const overlayClass = temaOscuro ? "bg-slate-900/80" : "bg-white/60";

  const isChat = paso === 'chat';
  const isCargando = paso === 'cargando';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${bgApp} font-sans transition-colors duration-500`}>
      
      <div className={`w-full max-w-[380px] h-[720px] max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl relative transition-all duration-300 border-[6px] ${temaOscuro ? 'border-slate-800 shadow-black/50' : 'border-white shadow-xl'}`}>
        
        {/* === ACTOR PRINCIPAL: AI ORB === */}
        <div 
          className={`
            absolute z-[100] flex items-center justify-center transition-all duration-[1000ms] cubic-bezier(0.34, 1.56, 0.64, 1)
            ${!isChat 
              ? `top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2` // Centro
              : `top-[18px] left-[20px] translate-x-0 translate-y-0`   // Header
            }
            ${isCargando ? 'scale-125 brightness-110' : ''}
          `}
        >
          {/* Tamaño dinámico controlado por props */}
          <AIOrb sizeClass={!isChat ? 'w-28 h-28' : 'w-10 h-10'} />
          
          {/* Badge de estado */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full transition-all duration-700 delay-700 shadow-md ${isChat ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
        </div>

        {/* === VISTA 1: LOGIN === */}
        <div 
          className={`
            absolute inset-0 z-50 flex flex-col p-8 ${bgCard} transition-all duration-700 ease-in-out
            ${isChat ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}
          `}
        >
          <div className="flex-1 flex flex-col justify-center items-center text-center relative">
            <div className="w-28 h-28 mb-10 shrink-0"></div> 
            
            <div className={`transition-all duration-500 transform ${isCargando ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
              <h1 className={`text-2xl font-bold mb-2 ${txtPrincipal} tracking-tight`}>Nexus AI</h1>
              <p className={`text-sm mb-8 ${txtSecundario} leading-relaxed`}>
                Identificación requerida para acceso al sistema neural.
              </p>
              
              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className={`group flex items-center px-4 py-3.5 rounded-2xl border transition-all duration-300 ${temaOscuro ? 'bg-slate-800/50 border-slate-700 focus-within:border-indigo-500 focus-within:bg-slate-800' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                  <User size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors mr-3" />
                  <input 
                    type="text" 
                    placeholder="Usuario" 
                    required
                    className={`bg-transparent outline-none w-full text-sm ${txtPrincipal} placeholder-gray-400`}
                    value={usuario.nombre}
                    onChange={e => setUsuario({...usuario, nombre: e.target.value})}
                  />
                </div>
                
                <div className={`group flex items-center px-4 py-3.5 rounded-2xl border transition-all duration-300 ${temaOscuro ? 'bg-slate-800/50 border-slate-700 focus-within:border-indigo-500 focus-within:bg-slate-800' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                  <Mail size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors mr-3" />
                  <input 
                    type="email" 
                    placeholder="Credencial (Email)" 
                    required
                    className={`bg-transparent outline-none w-full text-sm ${txtPrincipal} placeholder-gray-400`}
                    value={usuario.email}
                    onChange={e => setUsuario({...usuario, email: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 rounded-2xl shadow-[0_4px_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-6`}
                >
                  <span>Acceder</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            <div className={`absolute top-[65%] w-full flex flex-col items-center transition-all duration-500 delay-100 ${isCargando ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
               <p className={`text-sm font-medium ${txtPrincipal} animate-pulse`}>Conectando Neuralink...</p>
            </div>
            
          </div>
        </div>


        {/* === VISTA 2: CHAT === */}
        <div className="absolute inset-0 z-0 transition-all duration-700" style={estiloFondo}>
          <div className={`absolute inset-0 ${fondoUrl !== "default" ? overlayClass : ''} backdrop-blur-[2px] transition-colors duration-500`} />
        </div>

        <div className={`relative z-20 px-5 py-3.5 flex justify-between items-center transition-all duration-700 ${isChat ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} backdrop-blur-md ${temaOscuro ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-white/60'}`}>
          <div className="flex items-center gap-3 pl-10">
            <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-500">
              <h3 className={`font-bold text-sm tracking-wide ${txtPrincipal}`}>{BOT_INFO.nombre}</h3>
              <p className={`text-[10px] font-medium ${temaOscuro ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {escribiendo ? "Computando..." : "Sistema Operativo"}
              </p>
            </div>
          </div>

          <div className="flex gap-1">
             <button onClick={() => setTemaOscuro(!temaOscuro)} className={`p-2 rounded-full hover:bg-black/5 transition-colors ${txtSecundario}`}>
               {temaOscuro ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <button onClick={() => setIndiceFondo((prev) => (prev + 1) % FONDOS.length)} className={`p-2 rounded-full hover:bg-black/5 transition-colors ${txtSecundario}`}>
               <ImageIcon size={18} />
             </button>
             <button onClick={() => {setPaso('login'); setMensajes([]); setUsuario({nombre:'', email:''})}} className={`p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors ${txtSecundario}`}>
               <Trash2 size={18} />
             </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 z-10 custom-scrollbar flex flex-col gap-4 relative transition-opacity duration-700 delay-200 ${isChat ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center my-2 opacity-60">
             <span className="text-[10px] flex items-center gap-1 bg-black/5 px-2 py-1 rounded-md backdrop-blur-sm">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Conexión Segura SSL
             </span>
          </div>

          {mensajes.map((msg) => {
            const esMio = msg.remitente === "yo";
            return (
              <div key={msg.id} className={`flex flex-col w-full ${esMio ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.tipo === 'texto' && (
                  <div 
                    className={`
                      max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-[14px] leading-relaxed relative
                      ${esMio 
                        ? `bg-indigo-600 text-white rounded-br-sm` 
                        : (temaOscuro ? 'bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-sm' : 'bg-white text-gray-700 shadow-sm rounded-bl-sm')
                      }
                    `}
                  >
                    <p>{msg.texto}</p>
                    <div className={`text-[10px] flex items-center justify-end gap-1 mt-1 opacity-70 ${esMio ? 'text-indigo-100' : 'text-gray-400'}`}>
                      <span>{msg.hora}</span>
                      {esMio && (msg.estado === 'leido' ? <CheckCheck size={12} /> : <Check size={12} />)}
                    </div>
                  </div>
                )}
                {msg.tipo === 'productos' && (
                  <div className="w-full mt-1 mb-2">
                    <p className={`text-xs ml-1 mb-2 ${txtSecundario}`}>{msg.texto}</p>
                    <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar snap-x snap-mandatory">
                      {msg.data.map((prod) => (
                        <div key={prod.id} className={`snap-center shrink-0 w-44 rounded-xl overflow-hidden shadow-lg border transition-transform hover:scale-[1.02] ${temaOscuro ? 'bg-slate-800 border-slate-700' : 'bg-white border-white'}`}>
                          <div className="h-28 overflow-hidden relative">
                             <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover" />
                             <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center">
                               <Star size={8} className="mr-0.5 text-yellow-400 fill-yellow-400" /> {prod.rating}
                             </span>
                          </div>
                          <div className="p-3">
                            <h4 className={`text-sm font-bold truncate ${txtPrincipal}`}>{prod.nombre}</h4>
                            <div className="flex justify-between items-center mt-2">
                              <span className={`text-sm font-semibold ${temaOscuro ? 'text-indigo-400' : 'text-indigo-600'}`}>{prod.precio}</span>
                              <button className={`p-1.5 rounded-full bg-indigo-600 text-white shadow-md active:scale-90 transition-transform`}>
                                <ShoppingBag size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {escribiendo && (
            <div className="flex w-full justify-start animate-in fade-in">
              <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${temaOscuro ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm'}`}>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={mensajesEndRef} />
        </div>

        <div className={`relative z-30 flex flex-col transition-all duration-700 ${isChat ? 'translate-y-0' : 'translate-y-full'}`}>
          {!escribiendo && isChat && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient">
              {TAGS_SUGERIDOS.map(tag => (
                <button 
                  key={tag}
                  onClick={() => enviarMensaje(tag)}
                  className={`
                    whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full border shadow-sm transition-all active:scale-95
                    ${temaOscuro 
                      ? 'bg-slate-800 border-slate-700 text-indigo-300 hover:bg-slate-700' 
                      : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className={`p-3 pt-2 backdrop-blur-xl ${temaOscuro ? 'bg-slate-900/90 border-t border-slate-800' : 'bg-white/90 border-t border-gray-100'}`}>
            <form onSubmit={(e) => { e.preventDefault(); enviarMensaje(); }} className="flex items-end gap-2">
              <button type="button" className={`p-3 rounded-full transition-colors ${txtSecundario} hover:bg-black/5`}>
                <Paperclip size={20} />
              </button>
              
              <div className={`flex-1 rounded-[1.25rem] flex items-center px-4 py-2.5 transition-all focus-within:ring-1 focus-within:ring-indigo-500/50 ${temaOscuro ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <input 
                  type="text" 
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  placeholder="Comando de texto..." 
                  className="flex-1 bg-transparent outline-none border-none text-[15px] max-h-24 placeholder-gray-400"
                />
                <button type="button" className={`ml-2 ${txtSecundario} hover:text-indigo-500 transition-colors`}>
                  <Smile size={20} />
                </button>
              </div>

              <button 
                type="submit" 
                disabled={!nuevoMensaje.trim()}
                className={`p-3 rounded-full shadow-lg transform transition-all duration-300
                  ${!nuevoMensaje.trim() 
                    ? (temaOscuro ? 'bg-slate-800 text-slate-600' : 'bg-gray-200 text-gray-400')
                    : `bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-500/30`
                  }
                `}
              >
                <Send size={20} className={nuevoMensaje.trim() ? "ml-0.5" : ""} />
              </button>
            </form>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-gradient { mask-image: linear-gradient(to right, black 85%, transparent 100%); }
      `}</style>
    </div>
  );
}
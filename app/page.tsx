'use client'

import { useEffect, useState } from 'react'
import { Bell, LogOut, Mail, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Sidebar from '@/components/dashboard/Sidebar'
import { supabase } from '@/lib/supabaseClient'
import emailjs from 'emailjs-com'

// Define your pricing plans
const pricingPlans = [
  {
    "id": 1,
    "title": "Base",
    "price": "$18.699/mes",
    "description": "Ideal para proyectos iniciales o personales",
    "features": [
      "Landing page estática con diseño básico",
      "Mantenimiento mensual (1-2 actualizaciones)",
      "Community Management: 1 publicación semanal en Facebook o Instagram",
      "SEO básico y optimización de imágenes",
      "Integración con Google Analytics",
      "Formulario de contacto con notificación por correo",
      "Soporte por correo electrónico (respuesta en menos de 12 horas)"
    ],
    "link": "/planes/basico"
  },
  {
    "id": 2,
    "title": "Avanzado",
    "price": "$26.499/mes",
    "description": "Enfocado en pequeños negocios en crecimiento",
    "features": [
      "Desarrollo de sitio web de hasta 5 páginas con diseño responsive",
      "Mantenimiento mensual extendido",
      "SEO avanzado y optimización de velocidad",
      "Community Management: 2 publicaciones semanales y 1 historia en Facebook e Instagram",
      "Integración con Google My Business",
      "Reportes básicos de Google Analytics",
      "Formulario de contacto personalizado",
      "Soporte por email y WhatsApp (respuesta en menos de 12 horas)"
    ],
    "link": "/planes/negocios"
  },
  {
    "id": 3,
    "title": "Premium",
    "price": "$47.399/mes",
    "description": "Perfecto para empresas medianas con necesidades avanzadas",
    "features": [
      "Desarrollo de sitio web completo (hasta 10 páginas)",
      "Mantenimiento mensual avanzado",
      "SEO completo con optimización de conversión (CRO)",
      "Community Management completo: 3 publicaciones semanales, diseño de historias y respuesta a mensajes",
      "Campañas publicitarias básicas y automatización de marketing",
      "Google Analytics con reportes avanzados",
      "Chat en vivo integrado",
      "Reportes detallados de rendimiento",
      "Soporte premium con resolución en menos de 12 horas"
    ],
    "link": "/planes/empresa"
  },
  {
    "id": 4,
    "title": "Corporativo",
    "price": "Personalizado/mes",
    "description": "Soluciones a medida para grandes empresas y corporaciones",
    "features": [
      "Desarrollo de aplicaciones web personalizadas con funcionalidades avanzadas",
      "Integraciones de sistemas (CRM, ERP, etc.)",
      "Mantenimiento y monitoreo continuo de infraestructura en producción",
      "Community Management estratégico: 7 publicaciones semanales y campañas publicitarias avanzadas",
      "Análisis de competencia y estrategias SEO personalizadas",
      "Automatización avanzada de marketing y A/B testing",
      "Dashboard de datos personalizados y reportes detallados",
      "Soporte dedicado y reuniones mensuales (respuesta en menos de 12 horas)"
    ],
    "link": "/planes/corporativo"
  }
]

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [leadsData, setLeadsData] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('leads').select('*')
      if (error) {
        console.error('Error al obtener los datos:', error)
      } else {
        setLeadsData(data)
      }
    }
    fetchData()
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true)
    } else {
      alert('Credenciales incorrectas')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  const handleSendEmail = (contact) => {
    const selectedPlan = pricingPlans.find(plan => plan.title === contact.plan);
    
    if (!selectedPlan) {
        console.error('Plan no encontrado:', contact.plan);
        return;
    }

    // Preparar el contenido como variables
    const templateParams = {
        from_name: 'Tobias Ceballos',
        from_email: 'tobyceballos44@gmail.com',
        to_name: contact.name,
        to_email: contact.email,
        plan_name: selectedPlan.title,
        plan_price: selectedPlan.price,
        plan_description: selectedPlan.description,
        plan_features: selectedPlan.features.join(', '), // O envía una lista como string
        link: selectedPlan.link,
    };
    console.log(templateParams)
    emailjs
      .send('service_nq5v58q', 'template_nn6ekre', templateParams, 'lwN1duqTI3hROw-gZ')
      .then((response) => {
        console.log('Correo enviado exitosamente:', response.status, response.text);
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
      });
};

  

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <form onSubmit={handleLogin} className="p-6 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">Iniciar sesión</h2>
          <Input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-gray-800">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} id="alerts-mode" />
            <label htmlFor="alerts-mode" className="text-sm font-medium">
              Alertas
            </label>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4">
          <h2 className="text-2xl font-semibold mb-4">Formularios de Contacto</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsData.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.plan}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>
                          Ver detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Detalles del contacto</DialogTitle>
                          <DialogDescription>Información completa del formulario de contacto.</DialogDescription>
                        </DialogHeader>
                        {selectedContact && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right font-bold">Nombre:</label>
                              <span className="col-span-3">{selectedContact.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right font-bold">Email:</label>
                              <span className="col-span-3">{selectedContact.email}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right font-bold">Plan:</label>
                              <span className="col-span-3">{selectedContact.plan}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right font-bold">Mensaje:</label>
                              <span className="col-span-3">{selectedContact.message}</span>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={() => handleSendEmail(selectedContact)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Correo
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    </div>
  )
}

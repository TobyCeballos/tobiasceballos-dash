import { Menu } from 'lucide-react'
import React, { useState } from 'react'

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Panel de control</h1>
        <button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-8">
        <a href="/" className="block py-2 px-4 hover:bg-gray-700">Inicio</a>
        <a href="/content" className="block py-2 px-4 hover:bg-gray-700">Contenido</a>
        <a href="/settings" className="block py-2 px-4 hover:bg-gray-700">Configuración</a>
      </nav>
    </div>
  )
}

export default Sidebar
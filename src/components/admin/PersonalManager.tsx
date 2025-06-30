import React, { useState } from 'react';
import { Plus, Search, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { Personal } from '../../types';

export function PersonalManager() {
  const [personal, setPersonal] = useState<Personal[]>([
    {
      codigo: 1,
      nombre: 'Juan',
      apellidos: 'Pérez García',
      dni: '12345678',
      direccion: 'Av. Lima 123, San Isidro',
      telefono: '999999999',
      email: 'juan.perez@norteexpreso.com',
      cargo: 'Chofer',
      area: 'Operaciones'
    },
    {
      codigo: 2,
      nombre: 'Carlos',
      apellidos: 'García López',
      dni: '87654321',
      direccion: 'Jr. Arequipa 456, Miraflores',
      telefono: '888888888',
      email: 'carlos.garcia@norteexpreso.com',
      cargo: 'Chofer',
      area: 'Operaciones'
    },
    {
      codigo: 3,
      nombre: 'Ana',
      apellidos: 'Rodríguez Silva',
      dni: '11223344',
      direccion: 'Av. Brasil 789, Magdalena',
      telefono: '777777777',
      email: 'ana.rodriguez@norteexpreso.com',
      cargo: 'Vendedor',
      area: 'Ventas'
    },
    {
      codigo: 4,
      nombre: 'Miguel',
      apellidos: 'Torres Mendoza',
      dni: '44332211',
      direccion: 'Calle Los Olivos 321, San Borja',
      telefono: '666666666',
      email: 'miguel.torres@norteexpreso.com',
      cargo: 'Supervisor',
      area: 'Operaciones'
    },
    {
      codigo: 5,
      nombre: 'Laura',
      apellidos: 'Martínez Vega',
      dni: '55667788',
      direccion: 'Av. Javier Prado 654, San Isidro',
      telefono: '555555555',
      email: 'laura.martinez@norteexpreso.com',
      cargo: 'Contador',
      area: 'Administración'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const [showNewPersonalModal, setShowNewPersonalModal] = useState(false);

  const areas = [...new Set(personal.map(p => p.area))];
  const cargos = [...new Set(personal.map(p => p.cargo))];

  const filteredPersonal = personal.filter(persona => {
    const matchesSearch = 
      persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.dni.includes(searchTerm) ||
      persona.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.telefono.includes(searchTerm);

    const matchesArea = !filterArea || persona.area === filterArea;
    const matchesCargo = !filterCargo || persona.cargo === filterCargo;

    return matchesSearch && matchesArea && matchesCargo;
  });

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Operaciones':
        return 'bg-blue-100 text-blue-800';
      case 'Ventas':
        return 'bg-green-100 text-green-800';
      case 'Administración':
        return 'bg-purple-100 text-purple-800';
      case 'Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCargoIcon = (cargo: string) => {
    switch (cargo) {
      case 'Chofer':
        return '🚌';
      case 'Vendedor':
        return '💼';
      case 'Supervisor':
        return '👔';
      case 'Contador':
        return '📊';
      case 'Mecánico':
        return '🔧';
      default:
        return '👤';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro">Gestión de Personal</h1>
            <p className="mt-1 text-sm text-gris-suave">
              Administra los empleados y su información
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowNewPersonalModal(true)}
              className="bg-azul-oscuro text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Empleado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {personal.length}
              </h3>
              <p className="text-sm text-gris-suave">Total Empleados</p>
            </div>
          </div>
        </div>

        {areas.map((area, index) => (
          <div key={area} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                index === 0 ? 'bg-green-100' :
                index === 1 ? 'bg-purple-100' : 'bg-yellow-100'
              }`}>
                <Briefcase className={`h-6 w-6 ${
                  index === 0 ? 'text-green-600' :
                  index === 1 ? 'text-purple-600' : 'text-yellow-600'
                }`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-azul-oscuro">
                  {personal.filter(p => p.area === area).length}
                </h3>
                <p className="text-sm text-gris-suave">{area}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
              placeholder="Buscar por nombre, DNI, email..."
            />
          </div>
          <select 
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
          >
            <option value="">Todas las áreas</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <select 
            value={filterCargo}
            onChange={(e) => setFilterCargo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
          >
            <option value="">Todos los cargos</option>
            {cargos.map(cargo => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
          <button className="bg-azul-oscuro text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
            Exportar Lista
          </button>
        </div>
      </div>

      {/* Personal Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersonal.map((persona) => (
                <tr key={persona.codigo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-azul-oscuro flex items-center justify-center text-white font-medium">
                          {persona.nombre.charAt(0)}{persona.apellidos.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-azul-oscuro">
                          {persona.nombre} {persona.apellidos}
                        </div>
                        <div className="text-sm text-gris-suave">
                          DNI: {persona.dni}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getCargoIcon(persona.cargo)}</span>
                      <div className="text-sm font-medium text-azul-oscuro">
                        {persona.cargo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAreaColor(persona.area)}`}>
                      {persona.area}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-azul-oscuro">
                        <Phone className="h-4 w-4 mr-2 text-gris-suave" />
                        {persona.telefono}
                      </div>
                      <div className="flex items-center text-sm text-azul-oscuro">
                        <Mail className="h-4 w-4 mr-2 text-gris-suave" />
                        {persona.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start text-sm text-azul-oscuro">
                      <MapPin className="h-4 w-4 mr-2 text-gris-suave mt-0.5 flex-shrink-0" />
                      <span className="max-w-xs truncate">{persona.direccion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-azul-oscuro hover:text-primary-600">
                        Ver
                      </button>
                      <button className="text-amarillo-dorado hover:text-yellow-600">
                        Editar
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        Contrato
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {areas.map((area) => {
          const empleadosArea = personal.filter(p => p.area === area);
          const cargosArea = [...new Set(empleadosArea.map(p => p.cargo))];
          
          return (
            <div key={area} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold text-azul-oscuro mb-4">
                Área de {area}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gris-suave">Total empleados:</span>
                  <span className="font-semibold text-azul-oscuro">{empleadosArea.length}</span>
                </div>
                <div>
                  <span className="text-sm text-gris-suave">Cargos:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cargosArea.map(cargo => (
                      <span key={cargo} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        <span className="mr-1">{getCargoIcon(cargo)}</span>
                        {cargo} ({empleadosArea.filter(p => p.cargo === cargo).length})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
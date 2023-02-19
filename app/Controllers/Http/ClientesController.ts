import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cliente from 'App/Models/Cliente'

export default class ClientesController {

    public async setRegistrarCliente({request,response}:HttpContextContract){
        const dataCliente = request.only(['cedula','nombre','apellido','telefono','correo'])
        try{
            const cedulaCliente = dataCliente.cedula;
            const clienteExistente: number = await this.getValidarClienteExistente(cedulaCliente);
            if (clienteExistente === 0) {
                await Cliente.create(dataCliente);
                response.status(200).json({'msg':"Registro completo con exito"})
            } else {
                response.status(400).json({'msg':"Error, cedula existente"})
            }
        } catch (error){
            console.log(error)
            response.status(500).json({'msg':"Error en el servidor"})
        }
    }

    private async getValidarClienteExistente(cedula:number):Promise<number>{
        const total = await Cliente.query().where({'cedula':cedula})
        return total.length
    }

    public async getListarClientes(): Promise<Cliente[]>{
        const clientes = await Cliente.all()
        return clientes;
    }

    public async actualizarCliente({request}:HttpContextContract){
        const cedula = request.param('id');
        const cliente = await Cliente.findOrFail(cedula)
        const datos = request.all();
        cliente.nombre = datos.nombre
        cliente.apellido = datos.apellido
        cliente.telefono = datos.telefono
        cliente.correo = datos.correo
        await cliente.save()
        return {"msg": "Actualizado correctamente", "estado":200}

    }

    public async eliminarCliente({request}:HttpContextContract){
        const id = request.param('id')
        await Cliente.query().where('cedula',id).delete();
        return{"msg": `Ha eliminado la CC ${id} correctamente`, "estado": 200};

    }

}

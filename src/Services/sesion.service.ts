import { Injectable } from "@nestjs/common";
import {Sesion} from "../Models/sesion.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class SesionService{

    constructor(@InjectModel('Sesion') private readonly sesionModel: Model<Sesion>){}

    async insertSesion(request:RegisterSesionRequest): Promise<DefaultResponse>{

        const newSesion = new this.sesionModel({
            student: request.student,
            tipo: request.tipo,
            fecha: request.fecha
        }
            );

        const a = await newSesion.save();
        return new DefaultResponse(0,'Sesion registrada',a.id);
    }
    
    async getStudentSesions(studentId:string): Promise<SearchAllSesionsResponse>{
        let state=0;
        const sesions = await this.sesionModel.find({student:studentId},
            function(err,sesiones){
                if(err){
                    state = 1;
                    return [];
                }
                return sesiones;
            });
            
        return new SearchAllSesionsResponse(state,sesions);
    }  



    async deleteSesion(sesionId:string):Promise<DefaultResponse>{
       const result = await this.sesionModel.deleteOne({sesionId:sesionId}).exec();
       
       if(result.n ===0){
           return new DefaultResponse(1,'No se encontro la sesion',sesionId);
       }else{
           return new DefaultResponse(0,'Eliminado con exito',sesionId);
       }
    }
   
}


export class SearchSesionResponse{
    constructor(
        public state:number,
        public sesion:Sesion,
        public message?:string,
        
    ){}
}

export class SearchAllSesionsResponse{
    constructor(
        public state:number,
        public sesions:Sesion[],
    ){}
}


export class RegisterSesionRequest{

    constructor(
        public student:string,
        public tipo:number,
        public fecha:string
    ){}
}

export class DefaultResponse{
    constructor(
        public state:number,
        public message:string,
        public sesionId:string
    ){}
}


'use strict'

const Database = use('Database');
const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {

    async index({request , response}){
        // const data = await Database.table('users').select('*');
        const data = await User.all();

        return response.json({
            status: 200,
            message: "OK",
            data
        });
    }

    async show({params , response}){
        // const data = await Database.table('users').where('id' , params.id).select('*');
        const data = await User.find(params.id);

        return response.json({
            status: 200,
            message: "OK",
            data
        });
    }

    async store({request , response}){
        const user = new User();
        const { username , email , password } = request.all();
        const rules = {
            username: 'required|string|unique:users,username',
            email: 'required|email|unique:users,email',
            password: 'required'
        };

        const validation = await validate(request.all(), rules);

        if(validation.fails()) return response.json({status: 500, error: validation.messages()});

        user.username = username;
        user.email = email;
        user.password = password;

        await user.save();

        return response.json({
            status : 200,
            data: user,
            message: "Successfuly Insert Data"
        });
    }

    async update({params, request , response}){
        const body = request.all();
        const data = await User.find(params.id);

        if(!data) return response.json({status: 204, message: "Data tidak ada"})

        data.username = body.username;
        data.email = body.email;
        
        await data.save();

        return response.json({
            status : 201,
            message: "Berhasil update data",
            data
        });
    }

    async destroy({params , response}){
        const data = await User.find(params.id);

        if(!data) return response.json({status : 204 , message: "Data tidak ada"});

        await data.delete();

        return response.json({
            status: 201,
            message: "Berhasil delete data",
            data
        });
    }
}

module.exports = UserController

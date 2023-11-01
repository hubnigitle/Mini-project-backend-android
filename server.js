import http from 'http';
import data from './data.js';

const requestListener = (req, res) =>{
    const method = req['method'];
    const url = req.url.split('/')[1];
    const params = req.url.split('/')[2];

    res.setHeader('Content-Type', 'application/json');


    /**
     * METHOD GET
     * url '/user'
     * desc mengambil seluruh data
     */
    if(method == 'GET'){
        switch(url){
            case 'user':
                const responsJSON ={
                    message: "Data berhasil diambil",
                    data: data[0],
                };
                res.end(JSON.stringify(responsJSON));
                break;

        }
    };

    /**
     * METHOD POST
     * url '/user'
     * desc menambahkan satu data
     */
    if(method == 'POST'){

        let requestBody = '';
                req.on('data', (data)=>{
                    requestBody += data;
                    console.log(requestBody);
                });
                
        switch(url){
            case 'user':
                req.on('end', ()=>{
                    requestBody = JSON.parse(requestBody);
                    data.push(requestBody);
                    const responsJSON ={
                        message: "Data berhasil diinput",
                        data: data,
                    };
                    return res.end(JSON.stringify(responsJSON));
                });       
            break;
        }
    };

     /**
     * METHOD PUT
     * url '/user/:NamaBarang'
     * desc melakukan update data
     */
    if(method == 'PUT'){
        let requestBody = '';
                req.on('data', (data)=>{
                    requestBody += data;
                    console.log(requestBody);
                });
        switch(url){
            case 'user':
             req.on('end',()=>{
                requestBody = JSON.parse(requestBody);

                const dataFind = data.filter((m)=>m.NamaBarang === params);

                console.log(dataFind.length);

                if(dataFind.length <0){
                    res.statusCode = 404;
                    return res.end(
                        JSON.stringify({
                        message : 'data tidak ditemukan',
                    })
                    );
                }else{
                    res.statusCode = 200;
                    return res.end(JSON.stringify({
                        message : 'data berhasil diperbaharui',
                    }))
                }
             });
             break;
        }
    }

    /**
     * METHOD DELETE
     * url '/user/:NamaBarang'
     * desc meghapus data
     */
    if(method == 'DELETE'){
        switch(url){
            case 'user':
                const index = data.findIndex((m)=>{
                    return m.NamaBarang == params;
                });
                console.log(index);
                data.splice(index, 1);
                if( index == -1){
                    res.statusCode = 404;
                    return res.end(
                        JSON.stringify({
                        message : 'data tidak ditemukan',
                    })
                    ); 
                }else{
                    res.statusCode = 200;
                    return res.end(JSON.stringify({
                        message : 'data berhasil dihapus',
                    }))

                }
            break;
        }
    }
};
const app = http.createServer(requestListener);

const port = 3000;

app.listen(port, ()=> {
    console.log(`server running on port ${port}`);
});

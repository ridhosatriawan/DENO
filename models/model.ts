import { Client } from "https://deno.land/x/postgres/mod.ts";
import { QueryResult,QueryConfig } from "https://deno.land/x/postgres/query.ts";


const clien = new Client({
    hostname : "localhost",
    port : 5432,
    user : "postgres",
    password : "o",
    database : "blog"
});

export async function select(qry : QueryConfig | QueryConfig[]):Promise<any[]>{
    await clien.connect();
    let tables : any = [];
    let hasil : QueryResult | QueryResult[];
    if(Array.isArray(qry)){
        hasil= await clien.multiQuery(qry);
        hasil.forEach((obj) => {
            tables.push(obj.rowsOfObjects() );
        });
    } else {
        hasil = await clien.query(qry);
        tables = hasil.rowsOfObjects();
    }
    await clien.end();

    return tables;
}

export async function insert(qry : QueryConfig):Promise<any[]> {
    
    let tables : any = [];
    try{
        await clien.connect();
        let hasil : QueryResult = await clien.query(qry);
        await clien.end();
        tables[0] = 'sukses'
        tables[1] = 'jumlah baris yg tersimpan'+hasil.rowCount;
    } catch (error) {
        tables[0] = 'gagal';
        tables[1] = `${error}`;
    }
    

    return tables;
}
import express, { Request, Response } from 'express';
import { parse } from '@babel/parser';
import fs from 'fs';
import { Deobfuscator } from './deobfuscator/deobfuscator';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/runDeobfuscator', (req: Request, res: Response) => {
    const source: string = req.body.sourceCode;

    try {
        const ast = parse(source, { sourceType: 'unambiguous' });
        const deobfuscator = new Deobfuscator(ast);
        const output = deobfuscator.execute();
        res.send(output);
    } catch (error) {
        res.status(500).send('Error parsing or deobfuscating code.');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

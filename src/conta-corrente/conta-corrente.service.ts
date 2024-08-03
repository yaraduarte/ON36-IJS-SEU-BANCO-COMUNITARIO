import SaqueResult from 'src/interfaces/saqueResult';
import contaCorrente from './conta-corrente.model';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ContaCorrenteService {
    private readonly filePath = path.resolve('src/conta/contaCorrente.json')
    private leContas(): contaCorrente[] {
        const data = fs.readFileSync(this.filePath, 'utf8')
        return JSON.parse(data) as contaCorrente[]
    }
    public depositar(codigoConta: number, valor: number): contaCorrente {
        const contasCorrente = this.leContas()
        const contaCorrente = contasCorrente.find(contasCorrente => contasCorrente.codigo === Number(codigoConta))

        if(!contaCorrente){
            console.log(`Conta de número ${contaCorrente} não encontrada`)
        }

        contaCorrente.saldo += valor
        return contaCorrente
    }

    public sacar(codigoContaCorrente: number, valor: number): SaqueResult {
        const contasCorrente = this.leContas()
        const contaCorrente = contasCorrente.find(contas => contas.codigo === Number(codigoContaCorrente))

        if(!contaCorrente){
            console.log(`Conta de número ${contaCorrente} não encontrada`)
        }

        if (valor <= contaCorrente.saldo + contaCorrente.limiteChequeEspecial) {
            contaCorrente.saldo -= valor;
            return {
                saqueRealizado: true,
                mensagem: `Novo saldo da conta = R$${contaCorrente.saldo}`
            }
        }
        return {
            saqueRealizado: false,
            mensagem: `Não é possível sacar o valor pois o saldo da conta é = R$${contaCorrente.saldo}`
        }
    }

    public transferir(codigoContaCorrenteOrigem: number, valor: number, codigoContaDestino: number): Object {
        const saquePossivel: SaqueResult = this.sacar(codigoContaCorrenteOrigem, valor)
        if (saquePossivel.saqueRealizado) {
            this.depositar(codigoContaDestino, valor);
            return {
                tranferenciaRealizada: true,
                mensagem: `Tranferência realizada`
            }
        }
        return {
            tranferenciaRealizada: false,
            mensagem: `Tranferência não realizada`
        }
    }
}
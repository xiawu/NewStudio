// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import Tx from 'ethereumjs-tx';
import Buffer from 'buffer';
import { IProjectItem } from '../../models';

export function getFileCode(files: IProjectItem[], name: string) {
    const file = files.find(f => f.name.toLowerCase().endsWith(name.toLowerCase()));
    if (!file) {
        return '';
    }
    return file.code as string;
}

// TODO - Make sure the above function is actually functional
// export function getFileCode(files: IProjectItem[], name: string) {
//     const file = files.find(f => f.name.toLowerCase() === name.toLowerCase());
//     if (!file) {
//         return '';
//     }
//     return file.code as string;
// }

export function createDeployFile(buildFiles: IProjectItem[], contractArgs: any[]): string {
    let parsedABI;
    try {
        // TODO: think of passing contract name!
        parsedABI = JSON.parse(getFileCode(buildFiles, '.abi'));
    } catch {
        throw new Error('Cannot parse .abi file');
    }

    const binFileCode = getFileCode(buildFiles, '.bin');

    const contract = window.web3.eth.contract(parsedABI);
    const args = contractArgs.concat([{ data: binFileCode }]);

    let deployFileCode = null;
    let error;

    try {
        deployFileCode = contract.new.getData.apply(contract, args);
    } catch (e) {
        error = e.toString();
    }

    if (deployFileCode == null || (deployFileCode === binFileCode && contractArgs.length > 0)) {
        // Error
        throw new Error('Constructor arguments given are not valid. Too many/few or wrong types. ' + error);
    }

    return deployFileCode;
}

export function signTransaction(address: string, nonce: any, gasSettings: any, key: string, deployFile: string) {
    const tx = new Tx({
        from: address,
        to: '',
        // chainId: 333,
        value: '0x0',
        nonce,
        gasPrice: gasSettings.gasPrice,
        gasLimit: gasSettings.gasLimit,
        data: deployFile,
    });
    tx.sign(Buffer.Buffer.from(key, 'hex'));
    return tx;
}

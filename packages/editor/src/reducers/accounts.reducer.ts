// Copyright 2018 Superblocks AB
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

import { accountActions } from '../actions';
import { AnyAction } from 'redux';
import { IAccountConfigState } from '../models/state';
import { IProjectItem, IAccountEnvironment } from '../models';

export const initialState: IAccountConfigState =  {
    showAccountConfig: false,
    selectedAccount: undefined,
    selectedWallet: undefined,
    selectedAccountEnvironment: undefined,
};

export default function accountsReducer(state = initialState, action: AnyAction, rootState: any) {
    switch (action.type) {

        case accountActions.OPEN_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                selectedAccount: action.data.account,
                showAccountConfig: true
            };
        }

        case accountActions.CLOSE_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                showAccountConfig: false,
                selectedAccount: undefined
            };
        }

        case accountActions.SELECT_ACCOUNT_ENVIRONMENT: {
            const { account, environment } = action.data;
            const dappFileData: any = rootState.project.dappfileData;
            const dappFileAccounts = dappFileData.accounts;

            const dappFileAccount = dappFileAccounts.find((a: any) => a.name === account.name);
            const accountEnvironment: IAccountEnvironment = dappFileAccount._environments.find((e: IAccountEnvironment) => e.name === environment.name);

            if (accountEnvironment.data.wallet === 'development') {
                const address = rootState.project.openWallets[accountEnvironment.data.index];
                selectedAccountEnvironment = {
                    address,
                    locked: false,
                };
            } else if (accountEnvironment.data.wallet === 'private') {

            } else if (accountEnvironment.data.wallet === 'public') {

            }

            // selectedWallet =
            return {
                ...state,
            };
        }

        default:
            return state;
    }
}

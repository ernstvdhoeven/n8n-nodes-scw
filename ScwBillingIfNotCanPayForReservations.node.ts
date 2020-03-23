import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';


const DAY = 24 * 60 * 60 * 1000;

const CREDIT_PER_DAY = 100
const CREDIT_PER_FORK = 2
const CREDIT_PER_PAN = 10
const CREDIT_PER_DAY_ELEC = 5


function keep(element, index, array) {
    let daysPerId = {}

    for (let request of element.json.dataNew.calendar.requests) {
        let requestedDays = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / DAY);

        if (request.identity in daysPerId) {
            daysPerId[request.identity] += requestedDays;
        }
        else {
            daysPerId[request.identity] = requestedDays;
        }
    }

    for (let id in daysPerId) {
        let num = Number(id) - 1;
        if (num < 0 || num >= element.json.dataNew.billing.balance.length) {
            return true;
        }

        if (daysPerId[id] * CREDIT_PER_DAY > element.json.dataNew.billing.balance[num]) {
            return true;
        }
    }

    return false;
}


export class ScwBillingIfNotCanPayForReservations implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Cannot Pay For Reservations',
		name: 'scwBillingIfNotCanPayForReservations',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes that include reservation requests without the requester having enough balance to pay for those.',
		defaults: {
			name: 'Cannot Pay For Reservations',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

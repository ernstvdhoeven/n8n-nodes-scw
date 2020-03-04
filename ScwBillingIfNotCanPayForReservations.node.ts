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
		displayName: 'Scw Billing - If Not Can Pay For Reservations',
		name: 'scwBillingIfNotCanPayForReservations',
		group: ['transform'],
		version: 1,
		description: 'Continues if the person that currently has a reservation does not have the credit to pay for it.',
		defaults: {
			name: 'If Not Can Pay For Reservations',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

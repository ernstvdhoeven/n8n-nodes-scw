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

    for (let request of element[0].json.dataNew.calendar.requests) {
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
        if (num < 0 || num >= element[0].json.dataNew.billing.balance.length) {
            return true;
        }

        if (daysPerId[id] * CREDIT_PER_DAY + element[1].json > element[0].json.dataNew.billing.balance[num]) {
            return true;
        }
    }

    return false;
}


export class ScwBillingIfNotCanPayForReservationsAndAdditionalCost implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Billing - If Not Can Pay For Reservations And Additional Cost',
		name: 'scwBillingIfNotCanPayForReservationsAndAdditionalCost',
		group: ['transform'],
		version: 1,
		description: 'Continues if a person that currently has a reservation does not have the credit to pay for the reservation and potential additional costs.',
		defaults: {
			name: 'If Not Can Pay For Reservations And Additional Cost',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['State Change', 'Number'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const additionalCost = this.getInputData(1);

        const zippedData = itemsAll.map((k, i) => [k, additionalCost[i]]);
        const resultZipped = zippedData.filter(keep);
        const result = resultZipped.map((k, i) => k[0]);
        
        return this.prepareOutputData(result);
	}
}

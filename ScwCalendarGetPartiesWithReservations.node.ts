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


export class ScwCalendarGetPartiesWithReservations implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Parties With Reservation Requests',
		name: 'scwCalendarGetPartiesWithReservations',
		group: ['transform'],
		version: 1,
		description: 'Input: State - Output: Parties with a reservation request according to the input state.',
		defaults: {
			name: 'Get Parties With Reservation Requests',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State'],
        outputNames: ['Parties'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++)
            result.push({'json': Array.from(new Set(itemsAll[itemIndex].json.calendar['requests'].map((k, i) => k.identity)))});

		return this.prepareOutputData(result);
	}
}

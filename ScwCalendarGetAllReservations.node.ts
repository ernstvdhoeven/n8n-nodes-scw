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


export class ScwCalendarGetAllReservations implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Reservation Requests',
		name: 'scwCalendarGetAllReservations',
		group: ['transform'],
		version: 1,
		description: 'Input: State - Output: Reservation Requests that are found in the input state.',
		defaults: {
			name: 'Get Reservation Requests',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State'],
        outputNames: ['Reservation Requests'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++)
            result.push({'json': itemsAll[itemIndex].json.calendar['requests']});

		return this.prepareOutputData(result);
	}
}

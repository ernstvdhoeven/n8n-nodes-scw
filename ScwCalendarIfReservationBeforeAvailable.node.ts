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
    const availableEpoch = new Date(new Date().getTime() + 365 * DAY).getTime()
    for (const request of element.json.dataNew.calendar.requests)
        if (request.startDate.getTime() > availableEpoch)
            return true;

    return false;
}


export class ScwCalendarIfReservationBeforeAvailable implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Unavailable Date Requested',
		name: 'scwCalendarIfReservationBeforeAvailable',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which a reservation request has been added before the date has become available.',
		defaults: {
			name: 'Unavailable Date Requested',
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

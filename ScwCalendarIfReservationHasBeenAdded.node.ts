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
    if (element.json.dataNew.calendar.requests.length != element.json.dataOld.calendar.requests.length)
        return true;

    for (let i = 0; i < element.json.dataNew.calendar.requests.length; i++)
        if (element.json.dataNew.calendar.requests[i].startDate.getTime() != element.json.dataOld.calendar.requests[i].startDate.getTime() ||
            element.json.dataNew.calendar.requests[i].endDate.getTime() != element.json.dataOld.calendar.requests[i].endDate.getTime() ||
            element.json.dataNew.calendar.requests[i].identity != element.json.dataOld.calendar.requests[i].identity)
            return true;

    return false;
}


export class ScwCalendarIfReservationHasBeenAdded implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Calendar - If Reservation Request Has Been Added',
		name: 'scwCalendarIfReservationHasBeenAdded',
		group: ['transform'],
		version: 1,
		description: 'Continues if a reservation request has been added/changed in the current state.',
		defaults: {
			name: 'If Request Has Been Added',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State Change'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

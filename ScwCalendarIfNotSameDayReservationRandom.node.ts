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
    if (element.json.newData.calendar['requests'].length == 0)
        return false;

    const maxIdentity = Math.max(element.json.newData.calendar['requests'].map((k, i) => Number(k.identity))).toString();
    const identitiesInSchedule = new Set(element.json.newData.calendar['schedule']);

    return !identitiesInSchedule.has(maxIdentity);
}


export class ScwCalendarIfNotSameDayReservationRandom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Calendar - If Not Randomly Decided When Conflicting Reservation Requests',
		name: 'scwCalendarIfNotSameDayReservationRandom',
		group: ['transform'],
		version: 1,
		description: 'Continues if conflicts between reservations request (overlapping dates) are not randomly decided.',
		defaults: {
			name: 'Conflicting Reservation Requests Not Randomly Resolved',
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
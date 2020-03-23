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
    // this is a hack, to have less work when writing tests
    if (element.json.dataNew.calendar['requests'].length == 0)
        return false;

    const identitiesInRequests = new Set(element.json.dataNew.calendar['requests'].map((k, i) => k.identity));
    const identitiesInSchedule = new Set(element.json.dataNew.calendar['schedule']);
    const identitiesWithoutReservation = Array.from(identitiesInSchedule).filter(x => !identitiesInRequests.has(x));

    return identitiesWithoutReservation.length > 0;
}


export class ScwCalendarIfNotScheduleBasedOnReservations implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Unrequested Scheduled Days',
		name: 'scwCalendarIfNotScheduleBasedOnReservations',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which the schedule is not based on reservation requests.',
		defaults: {
			name: 'Unrequested Scheduled Days',
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

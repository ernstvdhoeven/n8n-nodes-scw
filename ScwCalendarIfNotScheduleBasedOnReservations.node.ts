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
		displayName: 'Scw Calendar - If Schedule Is Not Based On Reservation Requests',
		name: 'scwCalendarIfNotScheduleBasedOnReservations',
		group: ['transform'],
		version: 1,
		description: 'Continues if the schedule is not based on previous reservation requests.',
		defaults: {
			name: 'Schedule Not Based On Reservation Requests',
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

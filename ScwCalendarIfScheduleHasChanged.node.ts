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
    if (element.json.dataNew.calendar.schedule.length != element.json.dataOld.calendar.schedule.length)
        return true;

    for (let i = 0; i < element.json.dataNew.calendar.schedule.length; i++)
        if (element.json.dataNew.calendar.schedule[i] != element.json.dataOld.calendar.schedule[i])
            return true;

    return false;
}


export class ScwCalendarIfScheduleHasChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Calendar - If Schedule Has Changed',
		name: 'scwCalendarIfScheduleHasChanged',
		group: ['transform'],
		version: 1,
		description: 'Continues if the schedule has changed in the state change.',
		defaults: {
			name: 'If Schedule Has Changed',
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

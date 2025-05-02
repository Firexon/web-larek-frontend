import { IItem, IActions } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardView {
	protected template: HTMLTemplateElement;
	protected actions?: IActions;

	constructor(template: HTMLTemplateElement, actions?: IActions) {
		this.template = template;
		this.actions = actions;
	}

	render(item: IItem): HTMLElement {
		const card = this.template.content.cloneNode(true) as HTMLElement;
		const element = card.querySelector('.card') as HTMLElement;
	
		const category = card.querySelector('.card__category') as HTMLElement;
		const title = card.querySelector('.card__title') as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const price = card.querySelector('.card__price') as HTMLElement;
	
		category.textContent = item.category;
	
		const colorMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button',
		};
	
		const categoryKey = colorMap[item.category];
		if (categoryKey) {
			category.classList.add(`card__category_${categoryKey}`);
		}
	
		title.textContent = item.title;
		image.src = `${CDN_URL}${item.image}`;
		image.alt = item.title;
		price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
	
		element.addEventListener('click', (event) => {
			this.actions?.onClick?.(event);
		});
	
		return element;
	}
}


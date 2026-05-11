import React from 'react';
import { Pokemon } from '../../types';
import './card.css';

type CardProps = {
  pokemon: Pokemon;
};

export class Card extends React.Component<CardProps> {
  render() {
    const { name, sprites, description } = this.props.pokemon;

    return (
      <div className="pokemon-card">
        {sprites?.front_default && (
          <img
            src={sprites.front_default}
            alt={name}
            width={80}
            height={80}
            className="pokemon-card__image"
          />
        )}
        <div className="pokemon-card__info">
          <h3 className="pokemon-card__name">{name}</h3>
          {description && (
            <p className="pokemon-card__description">{description}</p>
          )}
        </div>
      </div>
    );
  }
}

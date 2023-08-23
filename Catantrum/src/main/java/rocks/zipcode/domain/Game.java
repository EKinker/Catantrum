package rocks.zipcode.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Game.
 */
@Entity
@Table(name = "game")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Game implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "min_players")
    private Integer minPlayers;

    @Column(name = "max_players")
    private Integer maxPlayers;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "category")
    private String category;

    @Column(name = "user_rating")
    private Integer userRating;

    @Column(name = "mechanic")
    private String mechanic;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Game id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Game name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMinPlayers() {
        return this.minPlayers;
    }

    public Game minPlayers(Integer minPlayers) {
        this.setMinPlayers(minPlayers);
        return this;
    }

    public void setMinPlayers(Integer minPlayers) {
        this.minPlayers = minPlayers;
    }

    public Integer getMaxPlayers() {
        return this.maxPlayers;
    }

    public Game maxPlayers(Integer maxPlayers) {
        this.setMaxPlayers(maxPlayers);
        return this;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public Integer getMinAge() {
        return this.minAge;
    }

    public Game minAge(Integer minAge) {
        this.setMinAge(minAge);
        return this;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public String getCategory() {
        return this.category;
    }

    public Game category(String category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getUserRating() {
        return this.userRating;
    }

    public Game userRating(Integer userRating) {
        this.setUserRating(userRating);
        return this;
    }

    public void setUserRating(Integer userRating) {
        this.userRating = userRating;
    }

    public String getMechanic() {
        return this.mechanic;
    }

    public Game mechanic(String mechanic) {
        this.setMechanic(mechanic);
        return this;
    }

    public void setMechanic(String mechanic) {
        this.mechanic = mechanic;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Game)) {
            return false;
        }
        return id != null && id.equals(((Game) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Game{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", minPlayers=" + getMinPlayers() +
            ", maxPlayers=" + getMaxPlayers() +
            ", minAge=" + getMinAge() +
            ", category='" + getCategory() + "'" +
            ", userRating=" + getUserRating() +
            ", mechanic='" + getMechanic() + "'" +
            "}";
    }
}

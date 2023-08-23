package rocks.zipcode.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Query.
 */
@Entity
@Table(name = "query")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Query implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "mechanic")
    private String mechanic;

    @Column(name = "category")
    private String category;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Query id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMechanic() {
        return this.mechanic;
    }

    public Query mechanic(String mechanic) {
        this.setMechanic(mechanic);
        return this;
    }

    public void setMechanic(String mechanic) {
        this.mechanic = mechanic;
    }

    public String getCategory() {
        return this.category;
    }

    public Query category(String category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Query)) {
            return false;
        }
        return id != null && id.equals(((Query) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Query{" +
            "id=" + getId() +
            ", mechanic='" + getMechanic() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}

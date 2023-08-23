package rocks.zipcode.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.web.rest.TestUtil;

class MechanicTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mechanic.class);
        Mechanic mechanic1 = new Mechanic();
        mechanic1.setId(1L);
        Mechanic mechanic2 = new Mechanic();
        mechanic2.setId(mechanic1.getId());
        assertThat(mechanic1).isEqualTo(mechanic2);
        mechanic2.setId(2L);
        assertThat(mechanic1).isNotEqualTo(mechanic2);
        mechanic1.setId(null);
        assertThat(mechanic1).isNotEqualTo(mechanic2);
    }
}

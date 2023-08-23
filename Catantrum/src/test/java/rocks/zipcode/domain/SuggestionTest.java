package rocks.zipcode.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.web.rest.TestUtil;

class SuggestionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Suggestion.class);
        Suggestion suggestion1 = new Suggestion();
        suggestion1.setId(1L);
        Suggestion suggestion2 = new Suggestion();
        suggestion2.setId(suggestion1.getId());
        assertThat(suggestion1).isEqualTo(suggestion2);
        suggestion2.setId(2L);
        assertThat(suggestion1).isNotEqualTo(suggestion2);
        suggestion1.setId(null);
        assertThat(suggestion1).isNotEqualTo(suggestion2);
    }
}

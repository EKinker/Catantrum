package rocks.zipcode.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.IntegrationTest;
import rocks.zipcode.domain.Suggestion;
import rocks.zipcode.repository.SuggestionRepository;

/**
 * Integration tests for the {@link SuggestionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SuggestionResourceIT {

    private static final String DEFAULT_RESULT = "AAAAAAAAAA";
    private static final String UPDATED_RESULT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/suggestions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SuggestionRepository suggestionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSuggestionMockMvc;

    private Suggestion suggestion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Suggestion createEntity(EntityManager em) {
        Suggestion suggestion = new Suggestion().result(DEFAULT_RESULT);
        return suggestion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Suggestion createUpdatedEntity(EntityManager em) {
        Suggestion suggestion = new Suggestion().result(UPDATED_RESULT);
        return suggestion;
    }

    @BeforeEach
    public void initTest() {
        suggestion = createEntity(em);
    }

    @Test
    @Transactional
    void createSuggestion() throws Exception {
        int databaseSizeBeforeCreate = suggestionRepository.findAll().size();
        // Create the Suggestion
        restSuggestionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suggestion)))
            .andExpect(status().isCreated());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeCreate + 1);
        Suggestion testSuggestion = suggestionList.get(suggestionList.size() - 1);
        assertThat(testSuggestion.getResult()).isEqualTo(DEFAULT_RESULT);
    }

    @Test
    @Transactional
    void createSuggestionWithExistingId() throws Exception {
        // Create the Suggestion with an existing ID
        suggestion.setId(1L);

        int databaseSizeBeforeCreate = suggestionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSuggestionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suggestion)))
            .andExpect(status().isBadRequest());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSuggestions() throws Exception {
        // Initialize the database
        suggestionRepository.saveAndFlush(suggestion);

        // Get all the suggestionList
        restSuggestionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(suggestion.getId().intValue())))
            .andExpect(jsonPath("$.[*].result").value(hasItem(DEFAULT_RESULT)));
    }

    @Test
    @Transactional
    void getSuggestion() throws Exception {
        // Initialize the database
        suggestionRepository.saveAndFlush(suggestion);

        // Get the suggestion
        restSuggestionMockMvc
            .perform(get(ENTITY_API_URL_ID, suggestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(suggestion.getId().intValue()))
            .andExpect(jsonPath("$.result").value(DEFAULT_RESULT));
    }

    @Test
    @Transactional
    void getNonExistingSuggestion() throws Exception {
        // Get the suggestion
        restSuggestionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSuggestion() throws Exception {
        // Initialize the database
        suggestionRepository.saveAndFlush(suggestion);

        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();

        // Update the suggestion
        Suggestion updatedSuggestion = suggestionRepository.findById(suggestion.getId()).get();
        // Disconnect from session so that the updates on updatedSuggestion are not directly saved in db
        em.detach(updatedSuggestion);
        updatedSuggestion.result(UPDATED_RESULT);

        restSuggestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSuggestion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSuggestion))
            )
            .andExpect(status().isOk());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
        Suggestion testSuggestion = suggestionList.get(suggestionList.size() - 1);
        assertThat(testSuggestion.getResult()).isEqualTo(UPDATED_RESULT);
    }

    @Test
    @Transactional
    void putNonExistingSuggestion() throws Exception {
        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();
        suggestion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSuggestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, suggestion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(suggestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSuggestion() throws Exception {
        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();
        suggestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuggestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(suggestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSuggestion() throws Exception {
        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();
        suggestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuggestionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suggestion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSuggestionWithPatch() throws Exception {
        // Initialize the database
        suggestionRepository.saveAndFlush(suggestion);

        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();

        // Update the suggestion using partial update
        Suggestion partialUpdatedSuggestion = new Suggestion();
        partialUpdatedSuggestion.setId(suggestion.getId());

        partialUpdatedSuggestion.result(UPDATED_RESULT);

        restSuggestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSuggestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSuggestion))
            )
            .andExpect(status().isOk());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
        Suggestion testSuggestion = suggestionList.get(suggestionList.size() - 1);
        assertThat(testSuggestion.getResult()).isEqualTo(UPDATED_RESULT);
    }

    @Test
    @Transactional
    void fullUpdateSuggestionWithPatch() throws Exception {
        // Initialize the database
        suggestionRepository.saveAndFlush(suggestion);

        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();

        // Update the suggestion using partial update
        Suggestion partialUpdatedSuggestion = new Suggestion();
        partialUpdatedSuggestion.setId(suggestion.getId());

        partialUpdatedSuggestion.result(UPDATED_RESULT);

        restSuggestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSuggestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSuggestion))
            )
            .andExpect(status().isOk());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
        Suggestion testSuggestion = suggestionList.get(suggestionList.size() - 1);
        assertThat(testSuggestion.getResult()).isEqualTo(UPDATED_RESULT);
    }

    @Test
    @Transactional
    void patchNonExistingSuggestion() throws Exception {
        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();
        suggestion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSuggestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, suggestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(suggestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSuggestion() throws Exception {
        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();
        suggestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuggestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(suggestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSuggestion() throws Exception {
        int databaseSizeBeforeUpdate = suggestionRepository.findAll().size();
        suggestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuggestionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(suggestion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Suggestion in the database
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSuggestion() throws Exception {
        // Initialize the database
        suggestionRepository.saveAndFlush(suggestion);

        int databaseSizeBeforeDelete = suggestionRepository.findAll().size();

        // Delete the suggestion
        restSuggestionMockMvc
            .perform(delete(ENTITY_API_URL_ID, suggestion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Suggestion> suggestionList = suggestionRepository.findAll();
        assertThat(suggestionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

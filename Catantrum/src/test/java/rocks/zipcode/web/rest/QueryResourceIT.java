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
import rocks.zipcode.domain.Query;
import rocks.zipcode.repository.QueryRepository;

/**
 * Integration tests for the {@link QueryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class QueryResourceIT {

    private static final String DEFAULT_MECHANIC = "AAAAAAAAAA";
    private static final String UPDATED_MECHANIC = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/queries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQueryMockMvc;

    private Query query;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Query createEntity(EntityManager em) {
        Query query = new Query().mechanic(DEFAULT_MECHANIC).category(DEFAULT_CATEGORY);
        return query;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Query createUpdatedEntity(EntityManager em) {
        Query query = new Query().mechanic(UPDATED_MECHANIC).category(UPDATED_CATEGORY);
        return query;
    }

    @BeforeEach
    public void initTest() {
        query = createEntity(em);
    }

    @Test
    @Transactional
    void createQuery() throws Exception {
        int databaseSizeBeforeCreate = queryRepository.findAll().size();
        // Create the Query
        restQueryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isCreated());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeCreate + 1);
        Query testQuery = queryList.get(queryList.size() - 1);
        assertThat(testQuery.getMechanic()).isEqualTo(DEFAULT_MECHANIC);
        assertThat(testQuery.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    @Transactional
    void createQueryWithExistingId() throws Exception {
        // Create the Query with an existing ID
        query.setId(1L);

        int databaseSizeBeforeCreate = queryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQueryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllQueries() throws Exception {
        // Initialize the database
        queryRepository.saveAndFlush(query);

        // Get all the queryList
        restQueryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(query.getId().intValue())))
            .andExpect(jsonPath("$.[*].mechanic").value(hasItem(DEFAULT_MECHANIC)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)));
    }

    @Test
    @Transactional
    void getQuery() throws Exception {
        // Initialize the database
        queryRepository.saveAndFlush(query);

        // Get the query
        restQueryMockMvc
            .perform(get(ENTITY_API_URL_ID, query.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(query.getId().intValue()))
            .andExpect(jsonPath("$.mechanic").value(DEFAULT_MECHANIC))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY));
    }

    @Test
    @Transactional
    void getNonExistingQuery() throws Exception {
        // Get the query
        restQueryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingQuery() throws Exception {
        // Initialize the database
        queryRepository.saveAndFlush(query);

        int databaseSizeBeforeUpdate = queryRepository.findAll().size();

        // Update the query
        Query updatedQuery = queryRepository.findById(query.getId()).get();
        // Disconnect from session so that the updates on updatedQuery are not directly saved in db
        em.detach(updatedQuery);
        updatedQuery.mechanic(UPDATED_MECHANIC).category(UPDATED_CATEGORY);

        restQueryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedQuery.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedQuery))
            )
            .andExpect(status().isOk());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
        Query testQuery = queryList.get(queryList.size() - 1);
        assertThat(testQuery.getMechanic()).isEqualTo(UPDATED_MECHANIC);
        assertThat(testQuery.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void putNonExistingQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();
        query.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQueryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, query.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(query))
            )
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();
        query.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQueryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(query))
            )
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();
        query.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQueryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQueryWithPatch() throws Exception {
        // Initialize the database
        queryRepository.saveAndFlush(query);

        int databaseSizeBeforeUpdate = queryRepository.findAll().size();

        // Update the query using partial update
        Query partialUpdatedQuery = new Query();
        partialUpdatedQuery.setId(query.getId());

        restQueryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuery))
            )
            .andExpect(status().isOk());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
        Query testQuery = queryList.get(queryList.size() - 1);
        assertThat(testQuery.getMechanic()).isEqualTo(DEFAULT_MECHANIC);
        assertThat(testQuery.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    @Transactional
    void fullUpdateQueryWithPatch() throws Exception {
        // Initialize the database
        queryRepository.saveAndFlush(query);

        int databaseSizeBeforeUpdate = queryRepository.findAll().size();

        // Update the query using partial update
        Query partialUpdatedQuery = new Query();
        partialUpdatedQuery.setId(query.getId());

        partialUpdatedQuery.mechanic(UPDATED_MECHANIC).category(UPDATED_CATEGORY);

        restQueryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuery))
            )
            .andExpect(status().isOk());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
        Query testQuery = queryList.get(queryList.size() - 1);
        assertThat(testQuery.getMechanic()).isEqualTo(UPDATED_MECHANIC);
        assertThat(testQuery.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void patchNonExistingQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();
        query.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQueryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, query.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(query))
            )
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();
        query.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQueryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(query))
            )
            .andExpect(status().isBadRequest());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQuery() throws Exception {
        int databaseSizeBeforeUpdate = queryRepository.findAll().size();
        query.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQueryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(query)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Query in the database
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQuery() throws Exception {
        // Initialize the database
        queryRepository.saveAndFlush(query);

        int databaseSizeBeforeDelete = queryRepository.findAll().size();

        // Delete the query
        restQueryMockMvc
            .perform(delete(ENTITY_API_URL_ID, query.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Query> queryList = queryRepository.findAll();
        assertThat(queryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

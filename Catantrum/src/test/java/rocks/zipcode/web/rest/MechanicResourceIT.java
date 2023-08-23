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
import rocks.zipcode.domain.Mechanic;
import rocks.zipcode.repository.MechanicRepository;

/**
 * Integration tests for the {@link MechanicResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MechanicResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mechanics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MechanicRepository mechanicRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMechanicMockMvc;

    private Mechanic mechanic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mechanic createEntity(EntityManager em) {
        Mechanic mechanic = new Mechanic().name(DEFAULT_NAME);
        return mechanic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mechanic createUpdatedEntity(EntityManager em) {
        Mechanic mechanic = new Mechanic().name(UPDATED_NAME);
        return mechanic;
    }

    @BeforeEach
    public void initTest() {
        mechanic = createEntity(em);
    }

    @Test
    @Transactional
    void createMechanic() throws Exception {
        int databaseSizeBeforeCreate = mechanicRepository.findAll().size();
        // Create the Mechanic
        restMechanicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mechanic)))
            .andExpect(status().isCreated());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeCreate + 1);
        Mechanic testMechanic = mechanicList.get(mechanicList.size() - 1);
        assertThat(testMechanic.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createMechanicWithExistingId() throws Exception {
        // Create the Mechanic with an existing ID
        mechanic.setId(1L);

        int databaseSizeBeforeCreate = mechanicRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMechanicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mechanic)))
            .andExpect(status().isBadRequest());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMechanics() throws Exception {
        // Initialize the database
        mechanicRepository.saveAndFlush(mechanic);

        // Get all the mechanicList
        restMechanicMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mechanic.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getMechanic() throws Exception {
        // Initialize the database
        mechanicRepository.saveAndFlush(mechanic);

        // Get the mechanic
        restMechanicMockMvc
            .perform(get(ENTITY_API_URL_ID, mechanic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mechanic.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingMechanic() throws Exception {
        // Get the mechanic
        restMechanicMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMechanic() throws Exception {
        // Initialize the database
        mechanicRepository.saveAndFlush(mechanic);

        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();

        // Update the mechanic
        Mechanic updatedMechanic = mechanicRepository.findById(mechanic.getId()).get();
        // Disconnect from session so that the updates on updatedMechanic are not directly saved in db
        em.detach(updatedMechanic);
        updatedMechanic.name(UPDATED_NAME);

        restMechanicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMechanic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMechanic))
            )
            .andExpect(status().isOk());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
        Mechanic testMechanic = mechanicList.get(mechanicList.size() - 1);
        assertThat(testMechanic.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingMechanic() throws Exception {
        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();
        mechanic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMechanicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mechanic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mechanic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMechanic() throws Exception {
        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();
        mechanic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMechanicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mechanic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMechanic() throws Exception {
        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();
        mechanic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMechanicMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mechanic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMechanicWithPatch() throws Exception {
        // Initialize the database
        mechanicRepository.saveAndFlush(mechanic);

        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();

        // Update the mechanic using partial update
        Mechanic partialUpdatedMechanic = new Mechanic();
        partialUpdatedMechanic.setId(mechanic.getId());

        restMechanicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMechanic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMechanic))
            )
            .andExpect(status().isOk());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
        Mechanic testMechanic = mechanicList.get(mechanicList.size() - 1);
        assertThat(testMechanic.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateMechanicWithPatch() throws Exception {
        // Initialize the database
        mechanicRepository.saveAndFlush(mechanic);

        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();

        // Update the mechanic using partial update
        Mechanic partialUpdatedMechanic = new Mechanic();
        partialUpdatedMechanic.setId(mechanic.getId());

        partialUpdatedMechanic.name(UPDATED_NAME);

        restMechanicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMechanic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMechanic))
            )
            .andExpect(status().isOk());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
        Mechanic testMechanic = mechanicList.get(mechanicList.size() - 1);
        assertThat(testMechanic.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingMechanic() throws Exception {
        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();
        mechanic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMechanicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mechanic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mechanic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMechanic() throws Exception {
        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();
        mechanic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMechanicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mechanic))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMechanic() throws Exception {
        int databaseSizeBeforeUpdate = mechanicRepository.findAll().size();
        mechanic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMechanicMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mechanic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mechanic in the database
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMechanic() throws Exception {
        // Initialize the database
        mechanicRepository.saveAndFlush(mechanic);

        int databaseSizeBeforeDelete = mechanicRepository.findAll().size();

        // Delete the mechanic
        restMechanicMockMvc
            .perform(delete(ENTITY_API_URL_ID, mechanic.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mechanic> mechanicList = mechanicRepository.findAll();
        assertThat(mechanicList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

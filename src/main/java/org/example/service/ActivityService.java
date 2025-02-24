package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.Activity;
import org.example.model.Contact;
import org.example.model.Customer;
import org.example.model.Opportunity;
import org.example.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActivityService {

    private final ActivityRepository activityRepository;

    public List<Activity> findAllActivities() {
        return activityRepository.findAll();
    }

    public Optional<Activity> findActivityById(Long id) {
        return activityRepository.findById(id);
    }

    public List<Activity> findActivitiesByCustomer(Customer customer) {
        return activityRepository.findByCustomer(customer);
    }

    public List<Activity> findActivitiesByContact(Contact contact) {
        return activityRepository.findByContact(contact);
    }

    public List<Activity> findActivitiesByOpportunity(Opportunity opportunity) {
        return activityRepository.findByOpportunity(opportunity);
    }

    public List<Activity> findActivitiesByType(String type) {
        return activityRepository.findByType(type);
    }

    public List<Activity> findActivitiesByStatus(String status) {
        return activityRepository.findByStatus(status);
    }

    public List<Activity> findActivitiesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return activityRepository.findByScheduledDateBetween(startDate, endDate);
    }

    public List<Activity> findRecentActivities() {
        return activityRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<Activity> findUpcomingActivities() {
        return activityRepository.findByScheduledDateAfterAndStatusOrderByScheduledDateAsc(
                LocalDateTime.now(), "Planned");
    }

    @Transactional
    public Activity saveActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    @Transactional
    public Activity completeActivity(Long id) {
        Optional<Activity> activityOpt = activityRepository.findById(id);
        if (activityOpt.isPresent()) {
            Activity activity = activityOpt.get();
            activity.setStatus("Completed");
            activity.setCompletedDate(LocalDateTime.now());
            return activityRepository.save(activity);
        }
        return null;
    }
}
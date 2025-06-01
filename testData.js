export const getSubjects = {
  id: 0,
  name: 'string',
  department: {
    id: 0,
    name: 'string',
    groups: [
      {
        id: 0,
        name: 'string',
        subgroups: [
          {
            id: 0,
            name: 'string',
            group: 'string',
            students: [
              {
                id: 0,
                firstName: 'string',
                lastName: 'string',
                user: {
                  id: 0,
                  username: 'string',
                  password: 'string',
                  roles: [
                    'ROLE_ADMIN'
                  ],
                  enabled: true,
                  authorities: [
                    'ROLE_ADMIN'
                  ],
                  accountNonExpired: true,
                  credentialsNonExpired: true,
                  accountNonLocked: true
                },
                group: 'string',
                subgroup: 'string'
              }
            ]
          }
        ],
        department: 'string',
        scheduleEntries: [
          'string'
        ]
      }
    ],
    professors: [
      {
        id: 0,
        firstName: 'string',
        lastName: 'string',
        user: {
          id: 0,
          username: 'string',
          password: 'string',
          roles: [
            'ROLE_ADMIN'
          ],
          enabled: true,
          authorities: [
            'ROLE_ADMIN'
          ],
          accountNonExpired: true,
          credentialsNonExpired: true,
          accountNonLocked: true
        },
        onlineLink: 'string',
        departments: [
          'string'
        ],
        scheduleEntries: [
          'string'
        ]
      }
    ]
  },
  scheduleEntries: [
    {
      id: 0,
      type: 'string',
      startTime: {
        hour: 0,
        minute: 0,
        second: 0,
        nano: 0
      },
      endTime: {
        hour: 0,
        minute: 0,
        second: 0,
        nano: 0
      },
      isOnline: true,
      onlineLink: 'string',
      professor: {
        id: 0,
        firstName: 'string',
        lastName: 'string',
        user: {
          id: 0,
          username: 'string',
          password: 'string',
          roles: [
            'ROLE_ADMIN'
          ],
          enabled: true,
          authorities: [
            'ROLE_ADMIN'
          ],
          accountNonExpired: true,
          credentialsNonExpired: true,
          accountNonLocked: true
        },
        onlineLink: 'string',
        departments: [
          'string'
        ],
        scheduleEntries: [
          'string'
        ]
      },
      rooms: [
        {
          id: 0,
          name: 'string',
          capacity: 0,
          building: 'string',
          floor: 0
        }
      ],
      groups: [
        {
          id: 0,
          name: 'string',
          subgroups: [
            {
              id: 0,
              name: 'string',
              group: 'string',
              students: [
                {
                  id: 0,
                  firstName: 'string',
                  lastName: 'string',
                  user: {
                    id: 0,
                    username: 'string',
                    password: 'string',
                    roles: [
                      'ROLE_ADMIN'
                    ],
                    enabled: true,
                    authorities: [
                      'ROLE_ADMIN'
                    ],
                    accountNonExpired: true,
                    credentialsNonExpired: true,
                    accountNonLocked: true
                  },
                  group: 'string',
                  subgroup: 'string'
                }
              ]
            }
          ],
          department: 'string',
          scheduleEntries: [
            'string'
          ]
        }
      ],
      subgroups: [
        {
          id: 0,
          name: 'string',
          group: 'string',
          students: [
            {
              id: 0,
              firstName: 'string',
              lastName: 'string',
              user: {
                id: 0,
                username: 'string',
                password: 'string',
                roles: [
                  'ROLE_ADMIN'
                ],
                enabled: true,
                authorities: [
                  'ROLE_ADMIN'
                ],
                accountNonExpired: true,
                credentialsNonExpired: true,
                accountNonLocked: true
              },
              group: 'string',
              subgroup: 'string'
            }
          ]
        }
      ],
      dates: [
        {
          id: 0,
          date: '2025-06-01',
          scheduleEntry: 'string'
        }
      ],
      subject: 'string'
    }
  ]
}

export const getSubGroups = {
  id: 0,
  name: 'string',
  group: {
    id: 0,
    name: 'string',
    subgroups: [
      'string'
    ],
    department: {
      id: 0,
      name: 'string',
      groups: [
        'string'
      ],
      professors: [
        {
          id: 0,
          firstName: 'string',
          lastName: 'string',
          user: {
            id: 0,
            username: 'string',
            password: 'string',
            roles: [
              'ROLE_ADMIN'
            ],
            enabled: true,
            authorities: [
              'ROLE_ADMIN'
            ],
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true
          },
          onlineLink: 'string',
          departments: [
            'string'
          ],
          scheduleEntries: [
            'string'
          ]
        }
      ]
    },
    scheduleEntries: [
      {
        id: 0,
        type: 'string',
        startTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0
        },
        endTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0
        },
        isOnline: true,
        onlineLink: 'string',
        professor: {
          id: 0,
          firstName: 'string',
          lastName: 'string',
          user: {
            id: 0,
            username: 'string',
            password: 'string',
            roles: [
              'ROLE_ADMIN'
            ],
            enabled: true,
            authorities: [
              'ROLE_ADMIN'
            ],
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true
          },
          onlineLink: 'string',
          departments: [
            'string'
          ],
          scheduleEntries: [
            'string'
          ]
        },
        rooms: [
          {
            id: 0,
            name: 'string',
            capacity: 0,
            building: 'string',
            floor: 0
          }
        ],
        groups: [
          'string'
        ],
        subgroups: [
          'string'
        ],
        dates: [
          {
            id: 0,
            date: '2025-06-01',
            scheduleEntry: 'string'
          }
        ],
        subject: {
          id: 0,
          name: 'string',
          department: {
            id: 0,
            name: 'string',
            groups: [
              'string'
            ],
            professors: [
              {
                id: 0,
                firstName: 'string',
                lastName: 'string',
                user: {
                  id: 0,
                  username: 'string',
                  password: 'string',
                  roles: [
                    'ROLE_ADMIN'
                  ],
                  enabled: true,
                  authorities: [
                    'ROLE_ADMIN'
                  ],
                  accountNonExpired: true,
                  credentialsNonExpired: true,
                  accountNonLocked: true
                },
                onlineLink: 'string',
                departments: [
                  'string'
                ],
                scheduleEntries: [
                  'string'
                ]
              }
            ]
          },
          scheduleEntries: [
            'string'
          ]
        }
      }
    ]
  },
  students: [
    {
      id: 0,
      firstName: 'string',
      lastName: 'string',
      user: {
        id: 0,
        username: 'string',
        password: 'string',
        roles: [
          'ROLE_ADMIN'
        ],
        enabled: true,
        authorities: [
          'ROLE_ADMIN'
        ],
        accountNonExpired: true,
        credentialsNonExpired: true,
        accountNonLocked: true
      },
      group: {
        id: 0,
        name: 'string',
        subgroups: [
          'string'
        ],
        department: {
          id: 0,
          name: 'string',
          groups: [
            'string'
          ],
          professors: [
            {
              id: 0,
              firstName: 'string',
              lastName: 'string',
              user: {
                id: 0,
                username: 'string',
                password: 'string',
                roles: [
                  'ROLE_ADMIN'
                ],
                enabled: true,
                authorities: [
                  'ROLE_ADMIN'
                ],
                accountNonExpired: true,
                credentialsNonExpired: true,
                accountNonLocked: true
              },
              onlineLink: 'string',
              departments: [
                'string'
              ],
              scheduleEntries: [
                'string'
              ]
            }
          ]
        },
        scheduleEntries: [
          {
            id: 0,
            type: 'string',
            startTime: {
              hour: 0,
              minute: 0,
              second: 0,
              nano: 0
            },
            endTime: {
              hour: 0,
              minute: 0,
              second: 0,
              nano: 0
            },
            isOnline: true,
            onlineLink: 'string',
            professor: {
              id: 0,
              firstName: 'string',
              lastName: 'string',
              user: {
                id: 0,
                username: 'string',
                password: 'string',
                roles: [
                  'ROLE_ADMIN'
                ],
                enabled: true,
                authorities: [
                  'ROLE_ADMIN'
                ],
                accountNonExpired: true,
                credentialsNonExpired: true,
                accountNonLocked: true
              },
              onlineLink: 'string',
              departments: [
                'string'
              ],
              scheduleEntries: [
                'string'
              ]
            },
            rooms: [
              {
                id: 0,
                name: 'string',
                capacity: 0,
                building: 'string',
                floor: 0
              }
            ],
            groups: [
              'string'
            ],
            subgroups: [
              'string'
            ],
            dates: [
              {
                id: 0,
                date: '2025-06-01',
                scheduleEntry: 'string'
              }
            ],
            subject: {
              id: 0,
              name: 'string',
              department: {
                id: 0,
                name: 'string',
                groups: [
                  'string'
                ],
                professors: [
                  {
                    id: 0,
                    firstName: 'string',
                    lastName: 'string',
                    user: {
                      id: 0,
                      username: 'string',
                      password: 'string',
                      roles: [
                        'ROLE_ADMIN'
                      ],
                      enabled: true,
                      authorities: [
                        'ROLE_ADMIN'
                      ],
                      accountNonExpired: true,
                      credentialsNonExpired: true,
                      accountNonLocked: true
                    },
                    onlineLink: 'string',
                    departments: [
                      'string'
                    ],
                    scheduleEntries: [
                      'string'
                    ]
                  }
                ]
              },
              scheduleEntries: [
                'string'
              ]
            }
          }
        ]
      },
      subgroup: 'string'
    }
  ]
}

export const getStudents = [
  {
    id: 0,
    firstName: 'string',
    lastName: 'string',
    user: {
      id: 0,
      username: 'string',
      password: 'string',
      roles: [
        'ROLE_ADMIN'
      ],
      enabled: true,
      authorities: [
        'ROLE_ADMIN'
      ],
      accountNonExpired: true,
      credentialsNonExpired: true,
      accountNonLocked: true
    },
    group: {
      id: 0,
      name: 'string',
      subgroups: [
        {
          id: 0,
          name: 'string',
          group: 'string',
          students: [
            'string'
          ]
        }
      ],
      department: {
        id: 0,
        name: 'string',
        groups: [
          'string'
        ],
        professors: [
          {
            id: 0,
            firstName: 'string',
            lastName: 'string',
            user: {
              id: 0,
              username: 'string',
              password: 'string',
              roles: [
                'ROLE_ADMIN'
              ],
              enabled: true,
              authorities: [
                'ROLE_ADMIN'
              ],
              accountNonExpired: true,
              credentialsNonExpired: true,
              accountNonLocked: true
            },
            onlineLink: 'string',
            departments: [
              'string'
            ],
            scheduleEntries: [
              'string'
            ]
          }
        ]
      },
      scheduleEntries: [
        {
          id: 0,
          type: 'string',
          startTime: {
            hour: 0,
            minute: 0,
            second: 0,
            nano: 0
          },
          endTime: {
            hour: 0,
            minute: 0,
            second: 0,
            nano: 0
          },
          isOnline: true,
          onlineLink: 'string',
          professor: {
            id: 0,
            firstName: 'string',
            lastName: 'string',
            user: {
              id: 0,
              username: 'string',
              password: 'string',
              roles: [
                'ROLE_ADMIN'
              ],
              enabled: true,
              authorities: [
                'ROLE_ADMIN'
              ],
              accountNonExpired: true,
              credentialsNonExpired: true,
              accountNonLocked: true
            },
            onlineLink: 'string',
            departments: [
              'string'
            ],
            scheduleEntries: [
              'string'
            ]
          },
          rooms: [
            {
              id: 0,
              name: 'string',
              capacity: 0,
              building: 'string',
              floor: 0
            }
          ],
          groups: [
            'string'
          ],
          subgroups: [
            {
              id: 0,
              name: 'string',
              group: 'string',
              students: [
                'string'
              ]
            }
          ],
          dates: [
            {
              id: 0,
              date: '2025-06-01',
              scheduleEntry: 'string'
            }
          ],
          subject: {
            id: 0,
            name: 'string',
            department: {
              id: 0,
              name: 'string',
              groups: [
                'string'
              ],
              professors: [
                {
                  id: 0,
                  firstName: 'string',
                  lastName: 'string',
                  user: {
                    id: 0,
                    username: 'string',
                    password: 'string',
                    roles: [
                      'ROLE_ADMIN'
                    ],
                    enabled: true,
                    authorities: [
                      'ROLE_ADMIN'
                    ],
                    accountNonExpired: true,
                    credentialsNonExpired: true,
                    accountNonLocked: true
                  },
                  onlineLink: 'string',
                  departments: [
                    'string'
                  ],
                  scheduleEntries: [
                    'string'
                  ]
                }
              ]
            },
            scheduleEntries: [
              'string'
            ]
          }
        }
      ]
    },
    subgroup: {
      id: 0,
      name: 'string',
      group: 'string',
      students: [
        'string'
      ]
    }
  }
]

export const getSchedule = [
  {
    id: 0,
    type: 'string',
    startTime: {
      hour: 0,
      minute: 0,
      second: 0,
      nano: 0
    },
    endTime: {
      hour: 0,
      minute: 0,
      second: 0,
      nano: 0
    },
    isOnline: true,
    onlineLink: 'string',
    professor: {
      id: 0,
      firstName: 'string',
      lastName: 'string',
      user: {
        id: 0,
        username: 'string',
        password: 'string',
        roles: [
          'ROLE_ADMIN'
        ],
        enabled: true,
        authorities: [
          'ROLE_ADMIN'
        ],
        accountNonExpired: true,
        credentialsNonExpired: true,
        accountNonLocked: true
      },
      onlineLink: 'string',
      departments: [
        {
          id: 0,
          name: 'string',
          groups: [
            'string'
          ],
          professors: [
            'string'
          ]
        }
      ],
      scheduleEntries: [
        'string'
      ]
    },
    rooms: [
      {
        id: 0,
        name: 'string',
        capacity: 0,
        building: 'string',
        floor: 0
      }
    ],
    groups: [
      {
        id: 0,
        name: 'string',
        subgroups: [
          {
            id: 0,
            name: 'string',
            group: 'string',
            students: [
              {
                id: 0,
                firstName: 'string',
                lastName: 'string',
                user: {
                  id: 0,
                  username: 'string',
                  password: 'string',
                  roles: [
                    'ROLE_ADMIN'
                  ],
                  enabled: true,
                  authorities: [
                    'ROLE_ADMIN'
                  ],
                  accountNonExpired: true,
                  credentialsNonExpired: true,
                  accountNonLocked: true
                },
                group: 'string',
                subgroup: 'string'
              }
            ]
          }
        ],
        department: {
          id: 0,
          name: 'string',
          groups: [
            'string'
          ],
          professors: [
            'string'
          ]
        },
        scheduleEntries: [
          'string'
        ]
      }
    ],
    subgroups: [
      {
        id: 0,
        name: 'string',
        group: 'string',
        students: [
          {
            id: 0,
            firstName: 'string',
            lastName: 'string',
            user: {
              id: 0,
              username: 'string',
              password: 'string',
              roles: [
                'ROLE_ADMIN'
              ],
              enabled: true,
              authorities: [
                'ROLE_ADMIN'
              ],
              accountNonExpired: true,
              credentialsNonExpired: true,
              accountNonLocked: true
            },
            group: 'string',
            subgroup: 'string'
          }
        ]
      }
    ],
    dates: [
      {
        id: 0,
        date: '2025-06-01',
        scheduleEntry: 'string'
      }
    ],
    subject: {
      id: 0,
      name: 'string',
      department: {
        id: 0,
        name: 'string',
        groups: [
          'string'
        ],
        professors: [
          'string'
        ]
      },
      scheduleEntries: [
        'string'
      ]
    }
  }
]
